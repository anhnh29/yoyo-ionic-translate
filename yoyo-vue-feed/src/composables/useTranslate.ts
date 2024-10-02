import { IComment, IPostItem } from "@/types/post";
import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";

const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const region = import.meta.env.VITE_AWS_REGION;

const client = new TranslateClient({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

// Function to translate text
const translateText = async (text: string, sourceLang: string, targetLang: string) => {
  try {
    const command = new TranslateTextCommand({
      Text: text,
      SourceLanguageCode: sourceLang,
      TargetLanguageCode: targetLang,
    });

    const response = await client.send(command);
    return response.TranslatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return null;
  }
};

// Composable function
export function useTranslate() {
  const translate = async (post: IPostItem | IComment, content: string, sourceLang: string, targetLang: string) => {
    const translatedText = await translateText(content, sourceLang, targetLang);
    if (translatedText) {
      post.translatedContent = translatedText;
    }
  };

  return {
    translate,
  };
}
