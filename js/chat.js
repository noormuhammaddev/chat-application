//Front-end developer test
/*
  - create a new file, add it into html
  - create a function to show realtime chat interface
  - style layout
  - call a dummy api function (supplied) to get / receive messages
  - show chat history from dummy api function

*/


var chat = new function () {
  var _events = {};
  this.getChatHistory = getChatHistory;
  function getChatHistory(callback) {
    var d = new Date();
    d.setTime(d.getTime() - 200000)
    var chats = [];
    chats.push({ datetime: new Date(d.setTime(d.getTime() + 2000)).toISOString(), message: "hello", from: "Visitor" });
    chats.push({ datetime: new Date(d.setTime(d.getTime() + 4000)).toISOString(), message: "Hi, how can I help you?", from: "Operator" });
    chats.push({ datetime: new Date(d.setTime(d.getTime() + 4000)).toISOString(), message: "I'm looking for a size 7, but can't find it", from: "Visitor" });
    chats.push({ datetime: new Date(d.setTime(d.getTime() + 4000)).toISOString(), message: "Ok, one moment I'll check the stock", from: "Operator" })
    chats.push({ datetime: new Date(d.setTime(d.getTime() + 10000)).toISOString(), message: "I'm sorry, there is no sie 7 available in that colour. There are some in red and blue however", from: "Operator" })
    chats.push({ datetime: new Date(d.setTime(d.getTime() + 4000)).toISOString(), message: "Oh great, thank you", from: "Visitor" });
    chats.push({ datetime: new Date(d.setTime(d.getTime() + 4000)).toISOString(), message: "my pleasure :-)", from: "Operator" });

    if (typeof (callback) == "function") {
      setTimeout(callback(chats), 1000);
    }
  }


  this.sendChat = sendChat;
  function sendChat(str) {
    dispatchChatEvent(str, "Visitor");
    if (str.indexOf("hello") != -1 || str.indexOf("hi") != -1) {
      console.log("if")
      setTimeout(operatorGreetingChat, 2000);
    } else if (str.indexOf("?") != -1) {
      console.log("else if")
      setTimeout(operatorAnswerChat, 2000);
    } else {
      console.log("else")
      setTimeout(operatorChat, 2000);
    }
  }

  var responses = [
    "OK, let me check that out for you",
    "Message received. I'll see what I can do.",
    "ok, thank you.",
    "I understand.",
    "Hmm, I'm not sure I understand, can you rephrase that?",
    "Right ok, let me sort that out for you."
  ];
  var greetings = [
    "Hello there, welcome to the site. How may I help you?",
    "Good day! How are you?",
    "Hello, what can I do for you?",
    "Hi and welcome!",
    "Greetings :-)"

  ]
  var answers = [
    "Thank you for your question.",
    "OK, let me check that out for you",
    "A very good question! Let me have a look...",
    "Hmm, ok give me a minute and I'll sort that out.",
    "Yes, I think so."
  ]
  function operatorChat() {
    var randResponse = responses[Math.floor(Math.random() * responses.length)];
    dispatchChatEvent(randResponse, "operator");
  }
  function operatorAnswerChat() {
    var randResponse = answers[Math.floor(Math.random() * responses.length)];
    dispatchChatEvent(randResponse, "operator");
  }
  function operatorGreetingChat() {
    var randResponse = greetings[Math.floor(Math.random() * responses.length)];
    dispatchChatEvent(randResponse, "operator");
  }

  function dispatchChatEvent(msg, from) {
    var event = new CustomEvent('chatreceived', { "detail": { datetime: new Date().toISOString(), message: msg, from: from } });

    var chat = document.getElementById("liveChat")
    // Listen for the event
    chat.addEventListener('chatreceived', showChat, false);

    // Dispatch the event.
    raiseEvent("chatreceived", { "chat": { datetime: new Date().toISOString(), message: msg, from: from } });
    chat.dispatchEvent(event)
    chat.removeEventListener('chatreceived', showChat)
  }

  this.addListener = function (eventName, callback) {
    var events = _events;
    callbacks = events[eventName] = events[eventName] || [];
    callbacks.push(callback);
  };

  function raiseEvent(eventName, args) {
    var callbacks = _events[eventName];
    if (typeof (callbacks) != "undefined") {
      for (var i = 0, l = callbacks.length; i < l; i++) {
        callbacks[i](args);
      }
    }
  }

  function showChat(e) {
    const messageData = CreateMessageItem([e.detail])
    var parentContainer = document.getElementById("liveChat");
    messageData.map(item => parentContainer.appendChild(item))
  }
}

function CreateMessageItem(chats) {
  let messages = []
  chats.map(item => {
    const messageWrapper = document.createElement('div')
    messageWrapper.className = "message-container"
    const timestamp = document.createElement("p")
    const message = document.createElement("p")
    const from = document.createElement("p")
    timestamp.className = "timestamp"
    message.className = "message"
    from.className = "message-sender"
    timestamp.textContent = item.datetime
    message.textContent = item.message
    from.textContent = item.from
    messageWrapper.appendChild(from)
    messageWrapper.appendChild(timestamp)
    messageWrapper.appendChild(message)
    messages.push(messageWrapper)
  })
  return messages
}

$(function () {
  function loadData(chats) {
    const messageData = CreateMessageItem(chats)
    var parentContainer = document.getElementById("chatHistory");
    messageData.map(item => parentContainer.appendChild(item))
  }

  chat.getChatHistory(loadData);

  document.getElementById("chatSubmit").addEventListener("click", () => chat.sendChat(document.getElementById("chatInput").value), false);

});