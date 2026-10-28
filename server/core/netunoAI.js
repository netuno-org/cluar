import { _val, _ai, _app, _log } from "@netuno/server-types";


const DEFAULT_MODEL = "deepseek-chat";

// Prompt de sistema utilizado por omissão nos prompts manuais (processPrompt).
const DEFAULT_SYSTEM_PROMPT = "Tu és um assistente prestável que responde de forma clara, objetiva e útil.";

class NetunoAI {
  constructor(model = null) {
    this.client = _ai.client();

    this.model =
      model ||
      _app
        .config()
        .getValues("ai", _val.map())
        .getValues("client", _val.map())
        .getValues("default", _val.map())
        .getString("model", DEFAULT_MODEL);
  }

  getMessageContent(response) {
    const choices = response.getValues("data").getList("choices");

    if (!choices || choices.size() === 0) {
      return null;
    }

    return choices.get(0).get("message").getString("content");
  }

  // Prompt manual. Recebe o prompt do utilizador e, opcionalmente, o prompt de sistema e as opções.
  processPrompt(userPrompt, systemPrompt = null, options = null) {
    try {
      if (!userPrompt) {
        return _val.map()
          .set("success", false)
          .set("error", "the 'userPrompt' is required");
      }

      const messages = _val.list()
        .add(_val.map()
          .set("role", "system")
          .set("content", systemPrompt || DEFAULT_SYSTEM_PROMPT)
        )
        .add(_val.map()
          .set("role", "user")
          .set("content", userPrompt)
        );

      const response = this.sendRequest(
        messages,
        options || _val.map().set("temperature", 0.7)
      );

      if (!response.getBoolean("success")) {
        return _val.map()
          .set("success", false)
          .set("error", "failed to get a response from the Netuno AI service")
          .set("details", response.get("details"));
      }

      const content = this.getMessageContent(response);

      if (content === null) {
        return _val.map()
          .set("success", false)
          .set("error", "the Netuno AI service returned an empty response");
      }

      return _val.map()
        .set("success", true)
        .set("text", content.trim());
    } catch (error) {
      _log.error("Prompt processing failed:", error);
      return _val.map()
        .set("success", false)
        .set("error", "prompt processing failed")
        .set("details", error.toString());
    }
  }

  // Geração/modificação de HTML. Recebe o HTML atual e as instruções do utilizador e devolve apenas o HTML resultante.
  processHtml(currentHtml, userPrompt) {
    try {
      // Prompt
      const systemPrompt = `
            Tu és um assistente especializado em HTML e CSS.
            Tua tarefa é modificar ou criar código HTML de acordo com as instruções do utilizador.
            IMPORTANTE: Nunca apague ou remova o conteúdo HTML existente, a menos que o utilizador peça explicitamente para fazê-lo.
            Mantenha sempre a estrutura básica do HTML original e apenas faça as alterações solicitadas.
            Se o HTML estiver vazio, cria um novo conteúdo conforme solicitado.
            Retorna apenas o código HTML resultante, sem explicações adicionais.
        `;

      const userMessage = `
            HTML atual:
            \`\`\`html
            ${currentHtml || ""}
            \`\`\`

            Instruções para modificação:
            ${userPrompt}

            Por favor, retorne apenas o código HTML resultante sem explicações adicionais.
        `;


      const messages = _val.list()
        .add(_val.map()
          .set("role", "system")
          .set("content", systemPrompt)
        )
        .add(_val.map()
          .set("role", "user")
          .set("content", userMessage)
        );

      const options = _val.map()
        .set("temperature", 0.7);

      const response = this.sendRequest(messages, options);

      if (!response.getBoolean("success")) {
        return _val.map()
          .set("success", false)
          .set("error", "failed to get a response from the Netuno AI service")
          .set("details", response.get("details"));
      }

      const responseData = response.getValues("data");
      _log.debug("Netuno AI Response:", responseData);

      const content = this.getMessageContent(response);
      let htmlResult = content;

      // Extrair o código HTML de blocos de código markdown
      const htmlMatch = content.match(/```html\s*([\s\S]*?)\s*```/) ||
        content.match(/```\s*([\s\S]*?)\s*```/);

      if (htmlMatch) {
        htmlResult = htmlMatch[1].trim();
      }

      return _val.map()
        .set("success", true)
        .set("html", htmlResult);
    } catch (error) {
      _log.error("HTML processing failed:", error);
      return _val.map()
        .set("success", false)
        .set("error", "HTML processing failed")
        .set("details", error.toString());
    }
  }

  // Tradução de texto. Recebe o texto original e a linguagem de destino e devolve apenas o texto traduzido.
  processTranslation(text, targetLanguage, options = null) {
    try {
      if (!text) {
        return _val.map()
          .set("success", false)
          .set("error", "the 'text' is required");
      }

      if (!targetLanguage) {
        return _val.map()
          .set("success", false)
          .set("error", "the 'targetLanguage' is required");
      }

      const systemPrompt = `
            Tu és um tradutor profissional e especializado.
            Tua tarefa é traduzir o texto fornecido pelo utilizador para ${targetLanguage}.
            Mantém o significado, o tom, a pontuação e a formatação original.
            Não adiciones explicações, comentários ou notas.
            Retorna apenas o texto traduzido.
        `;

      const messages = _val.list()
        .add(_val.map()
          .set("role", "system")
          .set("content", systemPrompt)
        )
        .add(_val.map()
          .set("role", "user")
          .set("content", text)
        );

      const response = this.sendRequest(
        messages,
        options || _val.map().set("temperature", 0.2)
      );

      if (!response.getBoolean("success")) {
        return _val.map()
          .set("success", false)
          .set("error", "failed to get a response from the Netuno AI service")
          .set("details", response.get("details"));
      }

      const content = this.getMessageContent(response);

      if (content === null) {
        return _val.map()
          .set("success", false)
          .set("error", "the Netuno AI service returned an empty response");
      }

      return _val.map()
        .set("success", true)
        .set("translation", content.trim());
    } catch (error) {
      _log.error("Translation failed:", error);
      return _val.map()
        .set("success", false)
        .set("error", "translation failed")
        .set("details", error.toString());
    }
  }

  getRequest(url) {
    try {
      return _val.map()
        .set("success", true)
        .set("data", this.client.models());
    } catch (error) {
      _log.error("Failed to list the models:", error);
      return _val.map()
        .set("success", false)
        .set("error", "failed to list the models from the Netuno AI service")
        .set("details", error.toString());
    }
  }

  sendRequest(messages, options) {
    try {
      const data = options
        ? this.client.chat(this.model, messages, options)
        : this.client.chat(this.model, messages);

      return _val.map()
        .set("success", true)
        .set("data", data);
    } catch (error) {
      _log.error("Chat completion failed:", error);
      return _val.map()
        .set("success", false)
        .set("error", "failed to get a response from the Netuno AI service")
        .set("details", error.toString());
    }
  }

  deleteRequest(key) {
    try {
      return _val.map()
        .set("success", true)
        .set("data", this.client.cancelStream(key));
    } catch (error) {
      _log.error("Failed to cancel the streaming:", error);
      return _val.map()
        .set("success", false)
        .set("error", "failed to cancel the streaming on the Netuno AI service")
        .set("details", error.toString());
    }
  }

  usage() {
    try {
      return _val.map()
        .set("success", true)
        .set("data", this.client.usage());
    } catch (error) {
      _log.error("Failed to get the usage:", error);
      return _val.map()
        .set("success", false)
        .set("error", "failed to get the usage from the Netuno AI service")
        .set("details", error.toString());
    }
  }
}

export { NetunoAI };
