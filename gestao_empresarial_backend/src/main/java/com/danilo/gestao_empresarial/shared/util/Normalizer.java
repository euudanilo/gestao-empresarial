package com.danilo.gestao_empresarial.shared.util;

public class Normalizer {
    public static String onlyDigits(String value) {
        return value == null ? null : value.replaceAll("\\D", "");
    }
}