


export default function MockLogin(email, senha) {
    return new Promise((resolve, reject) => {
        const response = {
            "response": "ok",
            "token": "123456"
        };

        const delay = email == "gorila@gmail.com" && senha =="gorila" ? 4000 : 2000;

        setTimeout(() => {
            if (email === "gorila@gmail.com" && senha === "gorila") {
                console.log("Logou");
                
                resolve(response);
            } else {
                console.log();
                console.log('Nao logou');
                
                reject(new Error("Credenciais inválidas"));
            }
        }, delay);
    });
}