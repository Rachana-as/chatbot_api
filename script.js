const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox=document.querySelector(".chatbox")
const chatbotToggler=document.querySelector(".chatbot-toggler")
const chabotClosebtn = document.querySelector(".close-btn ")



let userMessage;
const API_KEY ="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";
const inputHeight = chatInput.scrollHeight;


const createChatli = (message,className) => {
    const chatli=document.createElement("li");
    chatli.classList.add("chat",className);
    let chatContent = className === "outgoing" ? `<p>$</p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatli.innerHTML=chatContent;
    chatli.querySelector("p").textContent = message;

    return chatli
}

const generateResponse = (incomingChatLi) => {
    const API_URL ="https://api.openai.com/v1/chat/completions";
    const messageElement=incomingChatLi.querySelector("p");

    const requestOptions = {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${API_KEY}`
        },
        body : JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}]

        })
    }
    fetch(API_URL,requestOptions).then(res => res.json()).then(data => {
       messageElement.textContent = data.choices[0].message.content;
        // console.log(data);
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() =>   chatbox.scrollTo(0,chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage=chatInput.value.trim();
    if(!userMessage) return;

    chatInput.value="";
    chatInput.style.height = `${inputHeight}px`;

    //append users message to chat
    chatbox.append(createChatli(userMessage,"outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight);


    setTimeout(() =>{
        const incomingChatLi = createChatli("Thinking..... ","incoming")
        chatbox.appendChild(incomingChatLi)
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    },600 );
}


chatInput.addEventListener("input", () =>{
    //adjust height according to input in textarea
    chatInput.style.height = `${inputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});


chatInput.addEventListener("keydown", (e) =>{
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth>800){
        e.preventDefault();
        handleChat();

    }
});


chabotClosebtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

sendChatBtn.addEventListener("click",handleChat);