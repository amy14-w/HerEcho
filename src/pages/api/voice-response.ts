import type { NextApiRequest, NextApiResponse } from 'next';

// You need to set your Hugging Face API key in an environment variable
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Helper to call Hugging Face Inference API
async function hfRequest(model: string, data: any, isBinary = false) {
	const url = `https://api-inference.huggingface.co/models/${model}`;
	const headers: any = {
		Authorization: `Bearer ${HF_API_KEY}`,
	};
	if (!isBinary) headers['Content-Type'] = 'application/json';
	const body = isBinary ? data : JSON.stringify(data);
	const res = await fetch(url, { method: 'POST', headers, body });
	if (!res.ok) throw new Error(await res.text());
	return isBinary ? await res.arrayBuffer() : await res.json();
}

export const config = {
	api: {
		bodyParser: false, // We'll handle file upload manually
	},
};

// Parse multipart/form-data for audio upload
import { IncomingForm } from 'formidable';

async function parseForm(req: NextApiRequest): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const form = new IncomingForm();
			form.parse(req, (err, fields, files) => {
				if (err) return reject(err);
				const file = files.audio;
				if (!file) return reject('No audio file');
				// Support both array and single file
				const fileObj = Array.isArray(file) ? file[0] : file;
				const buffer = require('fs').readFileSync(fileObj.filepath);
				resolve(buffer);
			});
		});
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
	try {
		// 1. Get audio file from form-data
		const audioBuffer = await parseForm(req);
		console.log('Received audio file, size:', audioBuffer.length);

		// Try one more Hugging Face combination
		try {
			// 2. Transcribe audio - Using a smaller, more available model
			console.log('Calling Hugging Face model: facebook/wav2vec2-base-960h');
			const transcriptRes = await hfRequest('facebook/wav2vec2-base-960h', audioBuffer, true);
			const transcript = transcriptRes.text || 'Could not transcribe.';
			console.log('Transcript:', transcript);

			// 3. Generate response text - Using a simpler model
			console.log('Calling Hugging Face model: facebook/bart-large-cnn');
			const prompt = `Provide career advice for women about: ${transcript}`;
			const textRes = await hfRequest('facebook/bart-large-cnn', { inputs: prompt });
			const responseText = textRes[0]?.summary_text || textRes[0]?.generated_text || 'Here is some helpful career advice for women.';
			console.log('Response text:', responseText);

			// 4. Return text only (browser TTS will handle speech)
			// Returning without audio - we'll use browser TTS on frontend
			console.log('Hugging Face succeeded, returning text response');
			res.status(200).json({ 
				audio: null, // No audio, will use browser TTS
				text: responseText, 
				transcript,
				useBrowserTTS: true // Flag for frontend to use browser TTS
			});
		} catch (hfError: any) {
			console.log('Hugging Face failed:', hfError.message);
			console.log('Falling back to mock response with browser TTS');
			
			// Fallback to mock response
			const mockResponse = "To start a small business, first identify your passion and skills. Research your market and create a simple business plan. Start small, test your idea, and grow gradually. Focus on solving a real problem for your customers.";
			
			res.status(200).json({ 
				audio: null,
				text: mockResponse, 
				transcript: "Your voice message",
				useBrowserTTS: true
			});
		}
	} catch (err: any) {
		console.error('API /voice-response error:', err);
		res.status(500).json({ error: err.message || err });
	}
}
