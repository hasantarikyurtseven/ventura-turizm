import axios from 'axios';

export interface SoapPostOptions {
  url: string;
  clientKey: string;
  soapAction: string;
  xml: string;
  timeoutMs?: number;
}

export interface SoapPostResult {
  status: number;
  rawXml: string;
}

export async function soapPost(options: SoapPostOptions): Promise<SoapPostResult> {
  const res = await axios.post(options.url, options.xml, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'Client-key': options.clientKey,
      SOAPAction: `"${options.soapAction}"`,
    },
    timeout: options.timeoutMs ?? 30000,
  });

  return { status: res.status, rawXml: String(res.data) };
}

