import { BaseOutputParser, FormatInstructionsOptions } from "langchain/schema/output_parser";

class CommaSeparatedListOutputParser extends BaseOutputParser<string[]> {
    getFormatInstructions(options?: FormatInstructionsOptions): string {
        return ''
    }
    lc_namespace: string[];
    async parse(text: string): Promise<string[]> {
      return text.split(",").map((item) => item.trim());
    }
  }