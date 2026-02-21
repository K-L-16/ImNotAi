package com.kl.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Resutl 类，用于封装返回前端的数据
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {

    private Integer code; //编码： 1.成功，0为失败
    private String msg; //错误信息
    private Object data; //数据

    public static Result success(){
        Result result = new Result();
        result.code = 1;
        result.msg = "success";
        return result;
    }

    public static Result success(Object object){
        Result result = new Result();
        result.code = 1;
        result.msg = "success";
        result.data = object;
        return result;
    }

    public static Result error(String msg){
        Result result = new Result();
        result.code = 0;
        result.msg = msg;
        return result;
    }


}
