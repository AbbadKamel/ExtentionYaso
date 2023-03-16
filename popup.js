document.getElementById('submit').addEventListener('click', async () => {
  const question = document.getElementById('question').value;
  const chatElement = document.getElementById('chat');

  if (question) {
    const userMessageElement = createUserMessageElement(question);
    chatElement.appendChild(userMessageElement);
    chatElement.scrollTop = chatElement.scrollHeight;

    const assistantMessageElement = createAssistantMessageElement('Attendez un instant...');
    chatElement.appendChild(assistantMessageElement);
    chatElement.scrollTop = chatElement.scrollHeight;

    try {
      const response = await fetchChatGPTResponse(question);
      assistantMessageElement.innerText = response;
      chatElement.scrollTop = chatElement.scrollHeight;
    } catch (error) {
      assistantMessageElement.innerText = 'YASO : Une erreur est survenue.';
    }

    document.getElementById('question').value = '';
  }
});

function createUserMessageElement(text) {
  const messageElement = document.createElement('div');
  messageElement.className = 'user-message';
  messageElement.innerText = text;
  return messageElement;
}

function createAssistantMessageElement(text) {
  const messageElement = document.createElement('div');
  messageElement.className = 'assistant-message';
  messageElement.innerText = text;
  return messageElement;
}


async function fetchChatGPTResponse(question) {
  const apiKey = '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';
  const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';

  const headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  });

  const body = JSON.stringify({
    prompt: `Assistant YASO : \nUtilisateur : ${question}\nAssistant : `,
    max_tokens: 50,
    n: 1,
    stop: ["Utilisateur", "Assistant"], // Ajoutons "Utilisateur" pour arrêter la réponse à temps
    temperature: 0.5
  });


  const requestOptions = {
    method: 'POST',
    headers,
    body
  };

  const response = await fetch(apiUrl, requestOptions);
  const data = await response.json();

  if (data.choices && data.choices.length > 0) {
    const responseText = data.choices[0].text.trim();
    const formattedResponse = "YASO : " + responseText.replace(/\"/g, '');
    return formattedResponse;
  } else {
    throw new Error('No response from ChatGPT');
  }
}
