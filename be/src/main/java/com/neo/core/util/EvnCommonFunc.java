package com.neo.core.util;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileWriter;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.commons.httpclient.params.HttpConnectionManagerParams;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import com.google.gson.Gson;

public class EvnCommonFunc {

	@Value("${evn.url.info}")
	private String evnURLInfo;
	
	@Value("${evn.url.register}")
	private String evnURLRegister;
	
	@Value("${evn.encrypt}")
	private String evnEncrypt;
	
	@Value("${evn.url.payment}")
	private String evnURLPayment;
	
	@Value("${evn.url.login}")
	private String evnURLLogin;
	
	@Value("${evn.host}")
	private String evnHost;
	
	@Value("${log.path}")
	private String loginPath;
	
	@Autowired
    private ServletContext context;
	
	
	public String SendRequestHttp(String _method, String _url, String _query){
		String resp = "";
		try{
			if(_method.equalsIgnoreCase("GET")){
//				HTTP http = new HTTP();
//				http.server = evnHost;
//				if(_url.startsWith(evnURLInfo)) http.port = 8050;
//				else http.port = 8045;
//				http.httpsMode = false;
//				http.serverName = "42.112.213.225";
//				http.url = _url += "?" + _query;
//				http.getConnection();
//				resp = http.getContent();
				
				HttpGet http = new HttpGet();
				String uri = evnHost;
				if(_url.startsWith(evnURLInfo)) 
					uri+=":8050";
				else
					uri+=":8045";
				http.setURI(new URI(uri+"?"+_query));
				
				CloseableHttpClient client = HttpClients.createDefault();
				CloseableHttpResponse response = client.execute(http);
				List<Object> list = new ArrayList<>();
		        InputStream stream = response.getEntity().getContent();
		        BufferedReader reader = new BufferedReader(new InputStreamReader(stream));
		        reader.lines().forEach(item->{
		            System.out.println(item);
		            list.add(item);
		        });

		        Object[] arr= list.toArray();

		        for(Object s: arr){
		            resp+= String.valueOf(s);
		        }
				
			}else{
				URL url = new URL(_url);
				HttpURLConnection conn = (HttpURLConnection) url.openConnection();
				conn.setRequestMethod(_method);
				conn.setRequestProperty("User-Agent", "java-client");
				if(_url.indexOf("/carebot/PushMessage") != -1) conn.setRequestProperty("Content-type", "application/json; charset=UTF-8");
				else conn.setRequestProperty("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
				conn.setDoInput(true);
				conn.setDoOutput(true);
				conn.setUseCaches(false);
		    
			    DataOutputStream wr = new DataOutputStream(conn.getOutputStream());	    
			    wr.write(_query.getBytes("UTF-8"));
			    wr.flush();
			    wr.close();
		    
				String line;
				if(conn.getResponseCode() != 200){
					BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
					resp = "Error: ";
					while ((line = rd.readLine()) != null) {
						resp+= line;
					}
					rd.close();
				}else{		    
					// Get the response
					BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
					while ((line = rd.readLine()) != null) {
						resp+= line;
					}
					rd.close();
				}
			}
			System.out.println(resp);
		}catch(Exception e){
			e.printStackTrace();
			resp = "Exception: " + e.toString();
		}
		//if(_url != null && !_url.endsWith("/SP_NEW_LOGIN")) 
		WriteToLog(_method + "\t" + _url + "\t" + _query + "\t" + resp, "evnhn");
		return resp;
	}
	
	public String SendRequestHttps(String _method, String _url, String _query){
		String resp = "";
		try{
			URL url = new URL(_url);			
			HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
		    conn.setRequestMethod(_method);
		    conn.setRequestProperty("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
		    conn.setDoInput(true);
		    conn.setDoOutput(true);
		    conn.setUseCaches(false);
		    conn.setHostnameVerifier(new HostnameVerifier() {
		    	@Override
		    	public boolean verify(String hostname, SSLSession session) {
		    		return false;
		    	}
		    	}); 
		    SSLContext context = SSLContext.getInstance("TLS");
		    context.init(null, new TrustManager[]{
		    	new javax.net.ssl.X509TrustManager() {

					@Override
					public void checkClientTrusted(X509Certificate[] chain, String authType)
							throws CertificateException {
					}

					@Override
					public void checkServerTrusted(X509Certificate[] chain, String authType)
							throws CertificateException {
					}

					@Override
					public X509Certificate[] getAcceptedIssuers() {
						return null;
					}
		    	}
		    }, null);
		    conn.setSSLSocketFactory(context.getSocketFactory());
			
			DataOutputStream wr = new DataOutputStream(conn.getOutputStream());	    
			wr.writeBytes(_query);
			wr.flush();
			wr.close();
		
			String line;
			if(conn.getResponseCode() != 200){
				BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
				resp = "Error: ";
				while ((line = rd.readLine()) != null) {
					resp+= line;
				}
				rd.close();
			}else{		    
				// Get the response
				BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
				while ((line = rd.readLine()) != null) {
					resp+= line;
				}
				rd.close();
			}
			System.out.println(resp);
		}catch(Exception e){
			e.printStackTrace();
			resp = "Exception: " + e.toString();
		}
		WriteToLog(_method + "\t" + _url + "\t" + _query + "\t" + resp, "evnhn");
		return resp;
	}
	
	public String SendRequestXML(String _url, String _xmlRequest, String _soapAction){
		String resp = "";
		try{
			StringRequestEntity entity = new StringRequestEntity(_xmlRequest, "text/xml", "utf-8");
			PostMethod method = new PostMethod(_url);
			method.addRequestHeader("Content-Type", "text/xml");
			method.addRequestHeader("SOAPAction", _soapAction);
			method.setRequestEntity(entity);
			
			HttpConnectionManagerParams params = new HttpConnectionManagerParams();
			params.setSoTimeout(120 * 1000);
			params.setConnectionTimeout(90 * 1000);
			params.setMaxTotalConnections(200);
			params.setDefaultMaxConnectionsPerHost(200);
			//create client pool
			MultiThreadedHttpConnectionManager connectionManager = new MultiThreadedHttpConnectionManager();
			connectionManager.setParams(params);
			
			HttpClient httpClient = new HttpClient(connectionManager);
			int status = httpClient.executeMethod(method);
			if(status != 200){
				resp = "Exception: Http error code: " + status + method.getResponseBodyAsString();
			}else{
				resp = method.getResponseBodyAsString();
				resp = (resp != null) ? resp.trim() : resp;
			}
			System.out.println(resp);
		}catch(Exception e){
			e.printStackTrace();
			resp = "Exception: " + e.toString();
		}
		WriteToLog("POST\t" + _url + "\t" + _xmlRequest + "\t" + resp, "evnhn");
		return resp;
	}
	
	public void WriteToLog(String message, String subname){
		String logPath = loginPath + subname + "/";
		try{
			logPath = context.getRealPath("/") + "api/log/" + subname + "/";
		}catch(Exception e){}
		try{
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
			SimpleDateFormat sdffull = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
			File f = new File(logPath);
			if(!f.exists()) f.mkdir();
			String logfilename = logPath + sdf.format(new java.util.Date()) + ".txt";
			FileWriter fw = new FileWriter(logfilename, true);
			synchronized (fw) {
				fw.write(sdffull.format(new java.util.Date()) + "," + message + "\r\n");
				fw.flush();
				fw.close();
			}
		}catch (Exception e) {
			System.out.println("Exception in WriteToLog: " + e.toString());
			e.printStackTrace();
		}
	}
	
	public String toNonSign(String content){
		if(content == null) content = "";
		content = content.replaceAll("\r\n", "\n").replaceAll("…","...");
		for (int k=0; k < content.length(); k++){
			int codePoint = content.codePointAt(k);
			//Thay ky tu dac biet
			if(codePoint == 8 || codePoint == 173) content = content.replace(""+content.charAt(k), "");
			else if(codePoint == 9) content = content.replace(content.charAt(k), '\t');
			else if(codePoint == 10 || codePoint == 160) content = content.replace(content.charAt(k), '\n');
			else if(codePoint == 8211) content = content.replace(content.charAt(k), '-');
			else if (codePoint == 8216 || codePoint == 8217 || codePoint == 8242) content = content.replace(""+content.charAt(k), "'");
			else if (codePoint == 8220 || codePoint == 8221 || codePoint == 8243) content = content.replace(content.charAt(k), '"');
			else if(content.charAt(k) == '`' || content.charAt(k) == '~' || content.charAt(k) == '´' || content.charAt(k) == '©'
				|| codePoint == 768 || codePoint == 769 || codePoint == 803 || codePoint == 771 || codePoint == 777) content = content.replace(""+content.charAt(k), "");
			
			//Chuyen khong dau:
			if(codePoint >= 192 && codePoint <= 195) content = content.replace(content.charAt(k), 'A');
			else if(codePoint >= 201 && codePoint <= 202) content = content.replace(content.charAt(k), 'E');
			else if(codePoint >= 204 && codePoint <= 205) content = content.replace(content.charAt(k), 'I');
			else if(codePoint == 208 || codePoint == 272) content = content.replace(content.charAt(k), 'D');
			else if(codePoint >= 210 && codePoint <= 213) content = content.replace(content.charAt(k), 'O');
			else if(codePoint == 217 || codePoint == 218 || codePoint == 360 || codePoint == 431) content = content.replace(content.charAt(k), 'U');
			else if(codePoint == 221) content = content.replace(content.charAt(k), 'Y');
			else if(codePoint >= 224 && codePoint <= 227) content = content.replace(content.charAt(k), 'a');
			else if(codePoint >= 232 && codePoint <= 234) content = content.replace(content.charAt(k), 'e');
			else if(codePoint >= 236 && codePoint <= 237) content = content.replace(content.charAt(k), 'i');
			else if(codePoint >= 242 && codePoint <= 245) content = content.replace(content.charAt(k), 'o');
			else if(codePoint == 249 || codePoint == 250 || codePoint == 361 || codePoint == 432) content = content.replace(content.charAt(k), 'u');
			else if(codePoint == 253) content = content.replace(content.charAt(k), 'y');
			else if(codePoint == 273) content = content.replace(content.charAt(k), 'd');
			else if((codePoint >= 258 && codePoint <= 259) || (codePoint >= 7840 && codePoint <= 7863)){
				if(codePoint%2 == 0) content = content.replace(content.charAt(k), 'A');
				else content = content.replace(content.charAt(k), 'a');
			} else if(codePoint >= 7864 && codePoint <= 7879){
				if(codePoint%2 == 0) content = content.replace(content.charAt(k), 'E');
				else content = content.replace(content.charAt(k), 'e');
			} else if((codePoint >= 296 && codePoint <= 297) || (codePoint >= 7880 && codePoint <= 7883)){
				if(codePoint%2 == 0) content = content.replace(content.charAt(k), 'I');
				else content = content.replace(content.charAt(k), 'i');
			} else if((codePoint >= 416 && codePoint <= 417) || (codePoint >= 7884 && codePoint <= 7907)){
				if(codePoint%2 == 0) content = content.replace(content.charAt(k), 'O');
				else content = content.replace(content.charAt(k), 'o');
			} else if(codePoint >= 7908 && codePoint <= 7921){
				if(codePoint%2 == 0) content = content.replace(content.charAt(k), 'U');
				else content = content.replace(content.charAt(k), 'u');
			} else if(codePoint >= 7922 && codePoint <= 7929){
				if(codePoint%2 == 0) content = content.replace(content.charAt(k), 'Y');
				else content = content.replace(content.charAt(k), 'y');
			} 
		}
		return content;
	}
	
}
