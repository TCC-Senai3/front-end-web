import React from "react";
import "./style.css";

export default function TermsContent() {
    return (
        <main className="terms-main">
            <h2 className="terms-title">Termos de Uso do Senai Skill Up</h2>
            <div className="terms-content">
                <div className="terms-section">
                    <p className="terms-text">
                        Bem-vindo(a) ao Senai Skill Up!
                    </p>
                    <p className="terms-text">
                        Estes termos de uso ("Termos") regem o acesso e a utilização da nossa plataforma web. Ao se cadastrar ou utilizar o Senai Skill Up, você concorda com estes termos na íntegra. Por favor, leia-os atentamente.
                    </p>
                </div>

                <div className="terms-section">
                    <h3 className="terms-section-title">1. Privacidade e Proteção de Dados</h3>
                    <p className="terms-text">
                        As informações e dados pessoais fornecidos por você ao se cadastrar e utilizar a plataforma são armazenados em nosso banco de dados de forma segura. Comprometemo-nos a não divulgar, compartilhar, vender ou alugar seus dados pessoais a terceiros sem o seu consentimento, exceto nos casos em que for exigido por lei.
                    </p>
                </div>

                <div className="terms-section">
                    <h3 className="terms-section-title">2. Descrição da Plataforma</h3>
                    <p className="terms-text">
                        O Senai Skill Up é uma plataforma de aprendizado interativo que oferece questionários e materiais sobre diversas matérias, criados por usuários específicos. A plataforma inclui um sistema de pontuação (ranking) e um histórico de desempenho para cada usuário.
                    </p>
                </div>

                <div className="terms-section">
                    <h3 className="terms-section-title">3. Cadastro e Acesso</h3>
                    <p className="terms-text">
                        Para utilizar a plataforma, você deve se cadastrar fornecendo informações precisas e completas. Você é o único responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrerem em sua conta.
                    </p>
                </div>

                <div className="terms-section">
                    <h3 className="terms-section-title">4. Conteúdo e Propriedade Intelectual</h3>
                    <p className="terms-text">
                        Todo o conteúdo disponível na plataforma, incluindo questionários, textos, gráficos, imagens e o código-fonte, é de propriedade dos envolvidos nesse projeto e é protegido por leis de direitos autorais. Você não pode copiar, reproduzir, distribuir, publicar ou de qualquer forma usar o conteúdo sem a devida autorização.
                    </p>
                </div>

                <div className="terms-section">
                    <h3 className="terms-section-title">5. Uso do Perfil e Interação</h3>
                    <p className="terms-text">
                        Ao utilizar a plataforma, você concorda que:
                    </p>
                    <ul className="terms-list">
                        <li><strong>Visibilidade do Perfil:</strong> Outros usuários da plataforma poderão acessar seu perfil, visualizando seu nome de usuário, sua pontuação e seu histórico de desempenho nos questionários.</li>
                        <li><strong>Conduta do Usuário:</strong> Você se compromete a usar a plataforma de forma ética e respeitosa, não publicando ou compartilhando conteúdo ofensivo, ilegal ou que viole os direitos de terceiros.</li>
                        <li><strong>Uso Pessoal:</strong> A plataforma destina-se ao seu uso pessoal e educacional. É proibida a utilização para fins comerciais sem a nossa autorização expressa.</li>
                    </ul>
                </div>

                <div className="terms-section">
                    <h3 className="terms-section-title">6. Sistema de Pontuação (Ranking)</h3>
                    <p className="terms-text">
                        O Senai Skill Up utiliza um sistema de pontuação para classificar o desempenho dos usuários. As pontuações são baseadas na sua participação e no acerto dos questionários. O ranking é uma ferramenta de gamificação para incentivar o aprendizado e não deve ser interpretado como uma avaliação formal.
                    </p>
                </div>

                <div className="terms-section">
                    <h3 className="terms-section-title">7. Limitação de Responsabilidade</h3>
                    <p className="terms-text">
                        O Senai Skill Up é fornecido "como está". Não garantimos que a plataforma estará livre de erros ou interrupções, nem que todo o conteúdo será sempre preciso ou completo. Não nos responsabilizamos por perdas ou danos decorrentes do uso da plataforma.
                    </p>
                </div>

                <div className="terms-section">
                    <h3 className="terms-section-title">8. Encerramento da Conta</h3>
                    <p className="terms-text">
                        Podemos, a nosso critério, suspender ou encerrar sua conta se você violar qualquer uma das disposições destes termos.
                    </p>
                </div>
            </div>
        </main>
    );
}

