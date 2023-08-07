// Configurar as credenciais do Firebase
var firebaseConfig = {
    apiKey: "AIzaSyDvbGVVH6bSqxm-wKuJPznn2IG-mreoIpg",
    authDomain: "aula-fb3d1.firebaseapp.com",
    projectId: "aula-fb3d1",
    storageBucket: "aula-fb3d1.appspot.com",
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);

// Referenciar o Firestore
var db = firebase.firestore();

// Criar uma coleção chamada "videos" no Firestore (se já não existir)
var videosCollection = db.collection("videos");

// Capturar o formulário e salvar os links de vídeos do YouTube na coleção "videos" ao enviá-los
document.getElementById("meuFormulario").addEventListener("submit", function (event) {
    event.preventDefault();

    var videoLink = document.getElementById("videoLink").value;

    // Extrair o ID do vídeo do link de incorporação
    var videoId = extractVideoId(videoLink);

    if (videoId) {
        // Criar o link de incorporação com o ID do vídeo
        var embedLink = `https://www.youtube.com/embed/${videoId}`;

        // Adicionar um documento à coleção "videos" com o link de incorporação do vídeo
        videosCollection.add({
            embedLink: embedLink
        })
        .then(function (docRef) {
            console.log("Vídeo salvo com ID: ", docRef.id);
            alert("Vídeo salvo com sucesso!");
            // Limpar o campo do formulário após salvar o link do vídeo
            document.getElementById("meuFormulario").reset();
            // Atualizar a lista de vídeos salvos na página
            exibirVideosSalvos();
        })
        .catch(function (error) {
            console.error("Erro ao salvar vídeo: ", error);
            alert("Ocorreu um erro ao salvar o vídeo. Por favor, tente novamente.");
        });
    } else {
        alert("Link de vídeo inválido. Certifique-se de inserir um link de incorporação do YouTube.");
    }
});

// Função para extrair o ID do vídeo do link de incorporação do YouTube
function extractVideoId(url) {
    var match = url.match(/(?:https?:\/\/(?:www\.)?)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/|v\/|\.)([\w-]{11})(?![\w-])/);
    return match ? match[1] : null;
}

// Função para exibir os vídeos incorporados salvos na página
function exibirVideosSalvos() {
    var videosContainer = document.getElementById("videosSalvos");

    // Limpar o contêiner antes de atualizá-lo
    videosContainer.innerHTML = "";

    // Buscar os documentos na coleção "videos"
    videosCollection.get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // Criar um elemento de vídeo incorporado com o link de incorporação do vídeo
                var videoElement = document.createElement("iframe");
                videoElement.src = doc.data().embedLink;
                videoElement.width = "560";
                videoElement.height = "315";
                videosContainer.appendChild(videoElement);
            });
        })
        .catch(function (error) {
            console.error("Erro ao buscar vídeos: ", error);
        });
}

// Chamar a função de exibir vídeos ao carregar a página
exibirVideosSalvos();
