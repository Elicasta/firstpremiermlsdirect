// E-signature provider abstraction. Swap providers by implementing this interface
// and switching ESIGN_PROVIDER in the environment — nothing else in the app changes.

export interface SendAgreementParams {
  orderId: string;
  signerName: string;
  signerEmail: string;
  propertyAddress: string;
  packageName: string;
  totalAmount: number;
}

export interface SendAgreementResult {
  provider: "dropboxsign" | "docusign";
  envelopeId: string;
  signingUrl: string;
}

export interface EsignProvider {
  sendAgreement(params: SendAgreementParams): Promise<SendAgreementResult>;
  getSignedPdfUrl(envelopeId: string): Promise<string | null>;
}

// --- Dropbox Sign (HelloSign) implementation stub ---
class DropboxSignProvider implements EsignProvider {
  async sendAgreement(params: SendAgreementParams): Promise<SendAgreementResult> {
    // Real implementation: call Dropbox Sign's `signature_request/create_embedded_with_template`
    // using DROPBOXSIGN_API_KEY and DROPBOXSIGN_TEMPLATE_ID, pre-filling the fields below.
    // Docs: https://developers.hellosign.com/api/reference/operation/signatureRequestCreateEmbeddedWithTemplate/
    throw new Error(
      `Dropbox Sign integration not yet wired up. Params received: ${JSON.stringify(params)}`
    );
  }

  async getSignedPdfUrl(envelopeId: string): Promise<string | null> {
    throw new Error(`Dropbox Sign getSignedPdfUrl not yet wired up for ${envelopeId}`);
  }
}

// --- DocuSign implementation stub ---
class DocuSignProvider implements EsignProvider {
  async sendAgreement(params: SendAgreementParams): Promise<SendAgreementResult> {
    // Real implementation: JWT auth with DOCUSIGN_INTEGRATION_KEY + DOCUSIGN_PRIVATE_KEY,
    // then create an envelope from DOCUSIGN_TEMPLATE_ID via the eSignature REST API.
    // Docs: https://developers.docusign.com/docs/esign-rest-api/
    throw new Error(
      `DocuSign integration not yet wired up. Params received: ${JSON.stringify(params)}`
    );
  }

  async getSignedPdfUrl(envelopeId: string): Promise<string | null> {
    throw new Error(`DocuSign getSignedPdfUrl not yet wired up for ${envelopeId}`);
  }
}

export function getEsignProvider(): EsignProvider {
  const provider = process.env.ESIGN_PROVIDER ?? "dropboxsign";
  if (provider === "docusign") return new DocuSignProvider();
  return new DropboxSignProvider();
}
