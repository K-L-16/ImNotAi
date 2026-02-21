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

/**
 * AISERVICE
 * MODEL: OPENROUTER FREE MODEL
 *
 */
@Service
public class AiService {

    private final WebClient webClient;
    private final String model;
    private final long timeoutMs;

    public AiService(
            @Value("${openrouter.baseUrl}") String baseUrl,
            @Value("${openrouter.apiKey}") String apiKey,
            @Value("${openrouter.model}") String model,
            @Value("${openrouter.timeoutMs}") long timeoutMs,
            @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl
    ) {
        this.model = model;
        this.timeoutMs = timeoutMs;

        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                // HTTP-Referer: OpenRouter 用来统计请求来源和风控，应该指向实际的前端域名
                .defaultHeader("HTTP-Referer", frontendUrl)
                // X-Title: 自定义标识，用于 OpenRouter 统计应用信息
                .defaultHeader("X-Title", "ImNotAi-Backend")
                .build();
    }

    /**
     * 生成 AI 发言：保证返回非空、尽量短、失败则fallback
     */
    public String generateAiMessage(String premise, int round, List<String> visibleMessages, int maxLen) {
        String safePremise = premise == null ? "" : premise.trim();
        String context = String.join(" | ", visibleMessages == null ? List.of() : visibleMessages);

        //PROMOTE
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
                "max_tokens", 60,
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
    //IF CAN'T USE AI, USE ANYONE BELOW
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