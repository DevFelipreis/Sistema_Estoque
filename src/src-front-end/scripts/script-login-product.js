document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
    };

    try {
        document.getElementById('serverMessageLogin').innerText = ''; // Alterado para o ID correto
        const response = await fetch('http://localhost:3000/login', requestOptions);
        const data = await response.json();

        if (response.ok) {
            alert('Login efetuado com sucesso!');
            document.getElementById('serverMessageLogin').innerText = data.message;
        } else {
            throw new Error(data.message || 'Erro ao fazer login');
        }
    } catch (error) {
        alert('Erro fazer login: ' + error.message);
    }
});
