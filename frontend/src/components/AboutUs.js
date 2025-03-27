import React from 'react';

const AboutUs = () => {
    return (
        <div>
            <h2>Sobre Nós</h2>
            <p>
                Laminacao Galdino Industria e Comercio Ltda | CNPJ: 12.476.959/0001-87
                <br />
                Rua André de Almeida, 2378 - Cidade São Mateus, 03950-000, São Paulo - SP
                <br />
                55 11 2012 7118
                <br />
                laminacaogaldino@bol.com.br
            </p>
            <p>
                Nosso objetivo é fornecer a melhor experiência para nossos Clientes há mais de 20 anos.
            </p>
            <p>
                Aqui você pode se cadastrar e verificar nossos produtos.
            </p>
            <video width="600" controls>
                <source src="/video.mp4" type="video/mp4" />
                Seu navegador não suporta vídeos.
            </video>
        </div>
    );
};

export default AboutUs;
