package com.geometrycloud.ride;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class MainActivity extends AppCompatActivity {

    public static final String TAG = MainActivity.class.getName();

    private final JSONParser parser = new JSONParser();

    private WebView webView;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.browser);

        webView = (WebView) findViewById(R.id.web);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebChromeClient(new WebChromeClient());
        webView.getSettings().setDomStorageEnabled(true);

        webView.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    public void onBackPressed() {
        webView.evaluateJavascript("$.viewHistory();", new ValueCallback<String>() {
            @Override
            public void onReceiveValue(String value) {
                try {
                    JSONArray viewHistory = (JSONArray) parser.parse(value);

                    if (1 == viewHistory.size()) {
                        MainActivity.super.onBackPressed();
                    } else {
                        webView.evaluateJavascript("$('#back-action').trigger('click');", null);
                    }
                } catch (ParseException ex) {
                    MainActivity.super.onBackPressed();
                }
            }
        });
    }
}
