package com.kl.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    private final WebClient webClient;
    private final String model;
    private final long timeoutMs;

    public AiService(
            @Value("${openrouter.baseUrl}") String baseUrl,
            @Value("${openrouter.apiKey}") String apiKey,
            @Value("${openrouter.model}") String model,
            @Value("${openrouter.timeoutMs}") long timeoutMs
    ) {
        this.model = model;
        this.timeoutMs = timeoutMs;

        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                // OpenRouter 建议带的可选头：用于统计/风控（不带也能跑）
                .defaultHeader("HTTP-Referer", "http://localhost") // 线上可换成你的前端域名
                .defaultHeader("X-Title", "WhoIsAI-Hackathon")
                .build();
    }

    /**
     * 生成 AI 发言：保证返回非空、尽量短、失败则fallback
     */
    public String generateAiMessage(String premise, int round, List<String> visibleMessages, int maxLen) {
        String safePremise = premise == null ? "" : premise.trim();
        String context = String.join(" | ", visibleMessages == null ? List.of() : visibleMessages);

        // ✅ 核心：提示词要“像人”、要短、不要暴露自己是 AI
        String system = """
    You are a real human player in a social deduction chat game, not an AI.

    Rules:
    - Never reveal you are AI.
    - Reply with ONE short message only.
    - Keep it casual, natural, and human-like.
    - You may occasionally make small typing mistakes (like missing letters, wrong letters, or slight typos).
    - You may use hesitation words like "uh", "hmm", "maybe", "idk".
    - Do NOT sound too perfect or robotic.
    - Do NOT explain your reasoning fully.
    - Max %d characters. No emojis.

    Your message should feel like something a real person typed quickly.
    """.formatted(maxLen);

        String user = """
                Premise: %s
                Round: %d
                Messages this round: %s
                Speak now:
                """.formatted(safePremise, round, context);

        Map<String, Object> body = Map.of(
                "model", model,
                "temperature", 0.9,
                "max_tokens", 60, // token 不等于字符，但这里让它别输出太长
                "messages", List.of(
                        Map.of("role", "system", "content", system),
                        Map.of("role", "user", "content", user)
                )
        );

        try {
            Map<?, ?> resp = webClient.post()
                    .uri("/chat/completions")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofMillis(timeoutMs))
                    .onErrorResume(e -> Mono.empty())
                    .block();

            String text = extractContent(resp);
            text = normalize(text);

            if (text.isBlank()) {
                return fallback(maxLen);
            }
            if (text.length() > maxLen) {
                text = text.substring(0, maxLen);
            }
            return text;

        } catch (Exception e) {
            return fallback(maxLen);
        }
    }

    private String extractContent(Map<?, ?> resp) {
        if (resp == null) return "";
        Object choicesObj = resp.get("choices");
        if (!(choicesObj instanceof List<?> choices) || choices.isEmpty()) return "";

        Object first = choices.get(0);
        if (!(first instanceof Map<?, ?> firstMap)) return "";

        Object msgObj = firstMap.get("message");
        if (!(msgObj instanceof Map<?, ?> msgMap)) return "";

        Object content = msgMap.get("content");
        return content == null ? "" : content.toString();
    }

    private String normalize(String s) {
        if (s == null) return "";
        return s.replace("\n", " ")
                .replace("\r", " ")
                .trim();
    }

    private String fallback(int maxLen) {
        String[] canned = {
                "I guess that makes sense.",
                "Not sure, could be either.",
                "Wait, why though?",
                "Let's keep it simple.",
                "I don't fully agree."
        };
        String t = canned[(int)(Math.random() * canned.length)];
        return t.length() > maxLen ? t.substring(0, maxLen) : t;
    }
}