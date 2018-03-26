
document.addEventListener('DOMContentLoaded',function() {
    document.querySelector('input[name="uploader"]').onchange=changeEventHandler;
},false);

function changeEventHandler() {

    function postData(url, data) {
        // throw new Error(`Don't panic!`);
        return fetch(url, {
            body: data,
            method: 'POST'
        })
            .then(function(response) {

                if(response.ok)
                {
                    return response.json();
                }
                // throw new Error(response.statusText);
                return response.text();
            });
    }

    async function makeXhr(file) {

        let fd = new FormData();
        fd.append('fileUpload', file);
        fd.append('action', document.getElementById('resize-type').value);

        return await postData('/', fd);
    }

    const xhrArray = Array.from(this.files).map(async file => {

        try {
            const result = JSON.stringify(await makeXhr(file));

            const resultFinal = JSON.parse(result);
            console.log(`Ответ от сервера: ${result}`);

            let imgCard = document.createElement('div');
            imgCard.className = "item";
            imgCard.innerHTML = `<img src="${resultFinal.path}"/>
                                    <span>${(resultFinal.size/1000000).toFixed(2)}mb</span>
                                    <span>${resultFinal.time}ms</span>`;
            document.getElementById('uploaded').appendChild(imgCard);

        } catch (err) {
            console.log(`Ошибка от fetch: ${err.message}`)
        }

    });

    const start = async () => {
        await Promise.all(xhrArray);
    };

    start();

}