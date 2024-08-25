const wrapper = document.querySelector(".wrapper");
let searchInput = wrapper.querySelector("input");
let infoText = wrapper.querySelector(".info-text");
let synonymDict = wrapper.querySelector(".synonyms .list");
const volume = wrapper.querySelector(".word i");
const closeButton = wrapper.querySelector(".search .material-symbols-outlined");

let phonetics_2 = "";
let phonetics_1 = "";

let audio;
let i = 0;



//// Dictionary Functions
const showDictionary = async (data, word) =>{
    if(data.title == "No Definitions Found"){
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please try to search again for the correct word.`;
    }else{
        console.log(word, data);
        wrapper.classList.add("active");
        document.querySelector(".wrapper.active .info-text").style.display = "none";
        document.querySelector(".wrapper.active ul").style.display = "block";




        ////// Pass the exact response to the HTML elements

        ////**********Word and Meaning************
        document.querySelector(".word p").innerText = data[0].word;
        let meanings = data[0].meanings;
        let allDefinitions = meanings[meanings.length-1].definitions;
        document.querySelector(".meaning span").innerText = allDefinitions[0].definition;
        

        ////*********Example**********
        const filteredMeanings = meanings.map(meaning => {
            return meaning.definitions.filter(definition => {
                return Object.keys(definition).includes('example');
            });
        });
        
        // console.log(filteredMeanings);

        let exampleArr = filteredMeanings.filter(el => el.length > 0)[0];
        console.log(exampleArr);
        if(exampleArr == undefined){
            document.querySelector(".example span").style.display = "none";
        }else{
            document.querySelector(".example span").parentElement.style.display = "block";
            document.querySelector(".example span").innerText = "";
            document.querySelector(".example span").innerText = exampleArr[Math.floor(Math.random() * exampleArr.length)].example;
        }

        // console.log(exampleArr[Math.floor(Math.random() * exampleArr.length)].example);


        ////**********Phonetics**********

        const adjPartofSpeech = meanings.filter(meaning => meaning.partOfSpeech === "adjective");

        console.log(adjPartofSpeech);

        if(adjPartofSpeech.length <= 0){
            const adjPartofSpeech = meanings.filter(meaning => meaning.partOfSpeech === "noun");
            console.log(adjPartofSpeech);
            console.log(adjPartofSpeech[0].partOfSpeech);

            if(data[0].phonetics.length <= 0){
                wrapper.querySelector(".word .sound").style.display = "none";
            }else{
                phonetics_2 = data[0].phonetics[data[0].phonetics.length - 1].text;
                wrapper.querySelector(".word .sound").innerText = phonetics_2;
            }

            if(adjPartofSpeech[0].partOfSpeech.length <= 0){
                wrapper.querySelector(".word .text").style.display = "none";
            }else{
                phonetics_1 = adjPartofSpeech[0].partOfSpeech;
                wrapper.querySelector(".word .text").innerText = phonetics_1;
            }
        }
        else if(adjPartofSpeech.length <= 0){
            const adjPartofSpeech = meanings.filter(meaning => meaning.partOfSpeech === "verb");
            console.log(adjPartofSpeech);

            console.log(adjPartofSpeech[0].partOfSpeech);

            if(data[0].phonetics.length <= 0){
                wrapper.querySelector(".word .sound").style.display = "none";
            }else{
                phonetics_2 = data[0].phonetics[data[0].phonetics.length - 1].text;
                wrapper.querySelector(".word .sound").innerText = phonetics_2;
            }

            if(adjPartofSpeech[0].partOfSpeech.length <= 0){
                wrapper.querySelector(".word .text").style.display = "none";
            }else{
                phonetics_1 = adjPartofSpeech[0].partOfSpeech;
                wrapper.querySelector(".word .text").innerText = phonetics_1;
            }

        }
        else{
            console.log(adjPartofSpeech[0].partOfSpeech);
            phonetics_1 = adjPartofSpeech[0].partOfSpeech;
            document.querySelector(".word .text").innerText = phonetics_1;
            if(data[0].phonetics.length <= 0){
                document.querySelector(".word .sound").style.display = "none";
            }else{
                document.querySelector(".word .sound").style.display = "block";
                document.querySelector(".word .sound").infoText = "";
                phonetics_2 = data[0].phonetics[data[0].phonetics.length - 1].text;
                document.querySelector(".word .sound").innerText = phonetics_2;
            }
            
        }
        


        ////**********Synonyms***********

        const filteredSynonyms = meanings.filter(meaning => {
            return meaning.synonyms.length > 0;
        });

        const fs = [];
        for(filteredSynonym of filteredSynonyms){
            for(synonym of filteredSynonym.synonyms){
                fs.push(synonym);
            }
        }

        console.log(fs);
        
        if(fs.length <= 0){
            // synonymDict.parentElement.style.display = 'none';
            synonymDict.innerHTML = "";
            synonymDict.insertAdjacentHTML("beforeend", `<span style="text-decoration: none;">No Synonyms found</span>`);

        }else{
            // synonymDict.parentElement.style.display = "block";
            synonymDict.innerHTML = "";

            let trackRand = [];
            i = 1;

            while(trackRand.length < 6 && fs.length != 0) {

                console.log("i =>", i);
                
                console.log("fs", fs);
                let random = Math.floor(Math.random() * fs.length);
            
                console.log("random:", random);
            
            
                trackRand.push(random);
                console.log("trackRand", trackRand);
                
            
                let tag = '';
                if(i == 6 || fs.length == 1) {
                    tag = `<span onclick=search('${fs[random]}')>${fs[random]}</span>`;
                } else {
                    tag = `<span onclick=search('${fs[random]}')>${fs[random]},</span>`;
                }
            
                synonymDict.insertAdjacentHTML("beforeend", tag);
                
                // Remove the element at the index `random` from the array `fs`
                fs.splice(random, 1);  // This removes the item at the specified index
            
                i++;
            }
            
        }

        ////**********Audio************
        try{
            audio = new Audio(data[0].phonetics[data[0].phonetics.length - 1].audio);
        }catch{
            audio='';
        }
        volume.addEventListener("click", () => {
            audio.play();
        });


        ////***********Remove Search************
        closeButton.addEventListener("click", () => {
            searchInput.value = "";
            searchInput.focus();
        })

    }
}


////**********Search from synonyms**********
const search = (word) => {
    searchInput.value = word;
    fetchWordDetails(word);
}

//// Fecth API response
async function fetchWordDetails(word) {
    infoText.style.color = "#403d3d";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    
    try{
        let res = await axios.get(apiUrl);
        showDictionary(res.data, word);
    }catch(e){
        console.log("Error Occured");
        showDictionary(e.response.data, word);
    }

}

searchInput.addEventListener("keyup", event => {
    if(event.key === "Enter" && searchInput.value){
        fetchWordDetails(searchInput.value);
    }
})