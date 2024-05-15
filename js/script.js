const token = "";

function validarNome(){
    var nome = document.getElementById("input_nome");
    var mensagemErro = document.getElementById("erro_nome");
  
    if(nome.value.trim() === "" || nome.value.length < 3){
        nome.style.borderColor = "red";
        mensagemErro.textContent = "O nome deve ter pelo menos 3 caracteres";
    } else {
        nome.style.borderColor = "initial";
        mensagemErro.textContent = "";
    }
}

function validarNomeEmpresa(){
    var nome = document.getElementById("input_empresa");
    var mensagemErro = document.getElementById("erro_nome_empresa");
  
    if(nome.value.trim() === "" || nome.value.length < 3){
        nome.style.borderColor = "red";
        mensagemErro.textContent = "O nome deve ter pelo menos 3 caracteres";
    } else {
        nome.style.borderColor = "initial";
        mensagemErro.textContent = "";
    }
}

function validarCanalAtendimento(){
    var nome = document.getElementById("input_canal");
    var mensagemErro = document.getElementById("erro_canal");
  
    if(nome.value.trim() === "" || nome.value.length < 3){
        nome.style.borderColor = "red";
        mensagemErro.textContent = "O nome deve ter pelo menos 3 caracteres";
    } else {
        nome.style.borderColor = "initial";
        mensagemErro.textContent = "";
    }
}

function validarEmpreendimentoInteresse(){
    var nome = document.getElementById("input_empreendimento");
    var mensagemErro = document.getElementById("erro_empreendimento");
  
    if(nome.value.trim() === "" || nome.value.length < 3){
        nome.style.borderColor = "red";
        mensagemErro.textContent = "O nome deve ter pelo menos 3 caracteres";
    } else {
        nome.style.borderColor = "initial";
        mensagemErro.textContent = "";
    }
}

function validarTelefone(){
    var telefone = document.getElementById("input_telefone");
    var mensagemErro = document.getElementById("erro_telefone");
  
    if(telefone.value.trim() === "" || telefone.value.length < 10){
        telefone.style.borderColor = "red";
        mensagemErro.textContent = "O telefone deve ter pelo menos 11 caracteres";
    } else {
        telefone.style.borderColor = "initial";
        mensagemErro.textContent = "";
    }
}

function validarEmail(){
    var email = document.getElementById("input_email");
    var mensagemErro = document.getElementById("erro_email");
  
    if(email.value.trim() === "" || email.value.length < 3){
        email.style.borderColor = "red";
        mensagemErro.textContent = "O email deve ter pelo menos 3 caracteres";
    }
    else if(!email.value.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i)){
        email.style.borderColor = "red";
        mensagemErro.textContent = "Email inválido";
    }
    else {
        email.style.borderColor = "initial";
        mensagemErro.textContent = "";
    }
}

function validarCampos(campos) {
    for (let campo of campos) {
        if (campo.value.trim() === "" || campo.value.length < 3) {
            return false;
        }
    }
    return true;
}
async function enviarSalesforce() {
    let nome = document.getElementById("input_nome");
    let email = document.getElementById("input_email");
    let empresa = document.getElementById("input_empresa");
    let canal = document.getElementById("input_canal");
    let empreendimento = document.getElementById("input_empreendimento");
    let telefone = document.getElementById("input_telefone");
    let status = document.getElementById("select_status").value;
    let origem = document.getElementById("select_origem").value;
    let tipoPessoa = document.getElementById("select_tipo_pessoa").value;
    let idTipoPessoa = tipoPessoa === "Fisica" ? "012Dw0000001h2rIAA" : "012Dw0000001h2mIAA";
    let loading = document.getElementById("carregamento");


    loading.style.display = "block";

    if (!validarCampos([nome, email, empresa, canal, empreendimento, telefone])) {
      
        loading.style.display = "block";
    
        setTimeout(() => {
            loading.style.display = "none";
    
            Swal.fire({
                title: '<span style="color: white">Ops!</span>',
                html: '<span style="color: white">Por favor, preencha todos os campos corretamente.</span>',
                icon: 'error',
                confirmButtonColor: '#F57A45',
                background: '#282828',
                confirmButtonText: 'Entendi'
            });
        }, 3000); 
    

        return;
    }
    
    
    var data = {
        "Email": email.value,
        "LastName": nome.value,
        "Company": empresa.value,
        "LeadSource": origem,
        "CanalAtendimento__c": canal.value,
        "EmpreendimentoInteresse__c": empreendimento.value,
        "MobilePhone": telefone.value,
        "Status": status,
        "RecordTypeId" : idTipoPessoa
    };

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 00DDw000005FDf7!AQ8AQBo46eNf82GcuUz1n2_icelcfhBbGAQXMZA1b4rvKHTws7IAasReia_D05gF7wysK6vgHj_g.aabh4_SzkSmmNUSVWVv");
    myHeaders.append("Cookie", "BrowserId=LgYoZQ1DEe-Ym_-7cCSG1A; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1");
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(data),
        redirect: 'follow'
    };
    try {
        const response = await fetch("https://youinc--developer.sandbox.my.salesforce.com/services/apexrest/Lead/", requestOptions);
        if (response.ok) {
            loading.style.display = "none";
    
            const swalResponse = await Swal.fire({
                title: '<span style="color: white">Cadastro realizado!</span>',
                html: '<span style="color: white">Seu cadastro foi realizado com sucesso.</span>',
                icon: 'success',
                confirmButtonColor: '#F57A45',
                background: '#282828',
                confirmButtonText: 'Entendi'
            });
    
            if (swalResponse.isConfirmed) {
                const result = await response.text();
                console.log(result);
            }
        } else if (response.status === 400) {
            Swal.fire({
                title: '<span style="color: white">Ops!</span>',
                html: '<span style="color: white">Ocorreu um erro ao realizar o cadastro.</span>',
                icon: 'error',
                confirmButtonColor: '#F57A45',
                background: '#282828',
                confirmButtonText: 'Entendi'
            });
            throw new Error('Erro 400: Solicitação inválida');
        } else if (response.status === 200) {
            const result = await response.text();
            Swal.fire({
                title: '<span style="color: white">Lead existente!</span>',
                html: '<span style="color: white">' + result + '</span>',
                icon: 'info',
                confirmButtonColor: '#F57A45',
                background: '#282828',
                confirmButtonText: 'Entendi'
            });
        } else {
            Swal.fire({
                title: '<span style="color: white">Ops!</span>',
                html: '<span style="color: white">Ocorreu um erro ao realizar o cadastro.</span>',
                icon: 'error',
                confirmButtonColor: '#F57A45',
                background: '#282828',
                confirmButtonText: 'Entendi'
            });
            throw new Error('Erro ' + response.status + ': ' + response.statusText);
        }
    }
     catch (error) {
        Swal.fire({
            title: '<span style="color: white">Ops!</span>',
            html: '<span style="color: white">Ocorreu um erro ao realizar o cadastro.</span>',
            icon: 'error',
            confirmButtonColor: '#F57A45',
            background: '#282828',
            confirmButtonText: 'Entendi'
        });
        console.error('Erro:', error);
    } finally {
        setTimeout(() => {
            loading.style.display = "none";
        }, 5000); 
    }
}

