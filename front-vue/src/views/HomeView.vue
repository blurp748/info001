<template>
    <div class="container">
        <div v-for="char in textRef" v-bind:style="char.style">{{ char.char }}</div>
    </div>
    <textarea v-model="textareaRef" placeholder="Entrez un message"></textarea>
    <button @click="sendMessage">Remplacer le texte</button>
    <button @click="colorBlue">Bleu</button>
    <button @click="resetStyle">Reset</button>
</template>

<script setup>

import { ref, watch } from 'vue';
import { io } from 'socket.io-client';

let socket = io("http://localhost:3000")

socket.on("connect", () => {
	console.log("socket connected");
});

socket.on("message", (event) =>{

    if(event.action == "sendMessage"){
        let txt = ""
        event.value.forEach(char => {
            console.log(char)
            txt += char.char;
        });

        watcher();

        textareaRef.value = txt;
        textRef.value = event.value;
        txtSize = textareaRef.value.length

        watcher = watch(textareaRef, () => {
            sendMessage();
        });
    }

})

let textRef = ref([]);
let textareaRef = ref("");
let styleRef = ref({});
let txtSize = 0;

let watcher = watch(textareaRef, () => {
    sendMessage();
});

function sendMessage() {
    console.log("txtSize :",txtSize)
    console.log("textareaRef.value.length", textareaRef.value.length)
    if(textareaRef.value){
        if(textareaRef.value.length > txtSize){
            socket.emit('message',{
                action: "addCharacter",
                value: textareaRef.value.slice(-1),
            });
        }else{
            socket.emit('message',{
                action: "deleteCharacter"
            });
        }
        txtSize = textareaRef.value.length
    }
}

function changeStyle(){
    console.log(styleRef.value)
    socket.emit('message',{
        action: "changeStyle",
        value: styleRef.value
    })
}

function colorBlue(){
    styleRef.value.color = 'blue'
    changeStyle()
}

function resetStyle(){
    styleRef.value = {}
    changeStyle()
}

</script>

<style>

.container {
    display: flex;
    flex-direction: row;
    white-space: pre;
}

</style>