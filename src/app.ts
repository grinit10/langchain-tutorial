import express from 'express';
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate, ChatPromptTemplate } from "langchain/prompts";
import * as dotenv from 'dotenv'
import { CommaSeparatedListOutputParser } from 'langchain/schema/output_parser';
dotenv.config()

const app = express();
const port = 3000;
const llm = new OpenAI({
    openAIApiKey: process.env.OPEN_AI_KEY,
    temperature: 0
});
const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPEN_AI_KEY,
    temperature: 0
});
app.get('/llm', async (req, res) => {
    const text =
        "What would be a good company name for a company that makes colorful shoes?";
    res.send(await llm.predict(text));
});

app.get('/llm/prompt', async (req, res) => {
    const prompt = PromptTemplate.fromTemplate(
        "What is a good name for a company that makes {product}?"
    );
    const formattedPrompt = await prompt.format({
        product: "colorful socks",
    });
    res.send(await chatModel.predict(formattedPrompt));
});

app.get('/chat', async (req, res) => {
    const text =
        "What would be a good company name for a company that makes colorful shoes?";
    res.send(await chatModel.predict(text));
});

app.get('/chat/prompt-many-messages', async (req, res) => {
    const template =
        "You are a helpful assistant that translates {input_language} into {output_language}.";
    const humanTemplate = "{text}";
    const chatPrompt = ChatPromptTemplate.fromMessages([
        ["system", template],
        ["human", humanTemplate],
    ]);
    const formattedChatPrompt = await chatPrompt.formatMessages({
        input_language: "English",
        output_language: "French",
        text: "I love programming.",
    });
    res.send(await chatModel.predictMessages(formattedChatPrompt));
});


app.get('/chat/output-parser', async (req, res) => {
    const template =
        "You are a helpful assistant who generates comma separated lists. A user will pass in a category, and you should generate {num_objects} objects in that category in a comma separated list. ONLY return a comma separated list, and nothing more.";
    const humanTemplate = "{text}";
    const chatPrompt = ChatPromptTemplate.fromMessages([
        ["system", template],
        ["human", humanTemplate],
    ]);
    const parser = new CommaSeparatedListOutputParser();
    
    const chain = chatPrompt.pipe(chatModel).pipe(parser);

    const result = await chain.invoke({
        num_objects: "5",
        text: "Animals",
    });

    res.send(result);
});

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});