class OpenAI {
    constructor() {
        //this.assistantsId = _app.settings.getValues("openai").getString("assistantsId");
    }

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

            const requestData = _val.map()
                .set("model", "gpt-3.5-turbo")
                .set("messages", _val.list()
                    .add(_val.map()
                        .set("role", "system")
                        .set("content", systemPrompt)
                    )
                    .add(_val.map()
                        .set("role", "user")
                        .set("content", userMessage)
                    )
                )
                .set("temperature", 0.7);

            const requestCreate = _remote.init("openai")
                .setContentType("application/json")
                .setHeader(
                    _val.map()
                        .set("Accept", "*/*")
                        .set("Content-type", "application/json")
                );

            const response = requestCreate.post("chat/completions", requestData);

            if (!response.isOk()) {
                return _val.map()
                    .set("success", false)
                    .set("error", "Falha ao obter resposta da OpenAI")
                    .set("details", response.getContent());
            }

            const responseData = response.json();
            _log.debug("Resposta da OpenAI:", responseData);

            const content = responseData.getList("choices").get(0).get("message").getString("content");
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
            _log.error("Erro ao processar HTML:", error);
            return _val.map()
                .set("success", false)
                .set("error", "Erro ao processar HTML")
                .set("details", error.toString());
        }
    }

    getRequest(url) {
        const requestCreate = _remote.init("openai")
            .setContentType("application/json")
            .setHeader(
                _val.map()
                    .set("Accept", "*/*")
                    .set("Content-type", "application/json")
                    .set("OpenAI-Beta", "assistants=v2")
            )

        const response = requestCreate.get(`${url}`);

        if (response.isOk()) {
            return _val.map()
                .set("success", true)
                .set("data", response.json())
        }

        return _val.map()
            .set("success", false)
            .set("error", response.getContent())
    }

    sendRequest(url, requestData) {
        const requestCreate = _remote.init("openai")
            .setContentType("application/json")
            .setHeader(
                _val.map()
                    .set("Accept", "*/*")
                    .set("Content-type", "application/json")
                    .set("OpenAI-Beta", "assistants=v2")
            )

        const response = requestCreate.post(`${url}`,
            requestData
        );

        if (response.isOk()) {
            return _val.map()
                .set("success", true)
                .set("data", response.json())
        }

        return _val.map()
            .set("success", false)
            .set("error", response.getContent())
    }

    deleteRequest(url) {
        const requestCreate = _remote.init("openai")
            .setContentType("application/json")
            .setHeader(
                _val.map()
                    .set("Accept", "*/*")
                    .set("Content-type", "application/json")
                    .set("OpenAI-Beta", "assistants=v2")
            )

        const response = requestCreate.delete(`${url}`);

        if (response.isOk()) {
            return _val.map()
                .set("success", true)
                .set("data", response.json())
        }

        return _val.map()
            .set("success", false)
            .set("error", response.getContent())
    }
}
