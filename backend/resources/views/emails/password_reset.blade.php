<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Réinitialisation de mot de passe</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            background-color: #E1DEDE;
            max-width: 640px;
            display: flex;
            flex-direction: column;
            border: #979B97 solid 3px;
            border-radius: 8px;
            padding-inline: 20px;
            padding-block: 12px;
        }
        h3 {
            color: #121012;
            text-align: center;
            font-size: 28px;
            font-family: 'Montserrat', sans-serif;
            margin-block-start: 0;
            margin-block-end: 0;
        }
        a {
            background-color: #F339F4;
            color: #121012;
            padding-inline: 20px;
            padding-block: 12px;
            border-radius: 8px;
            border: #F339F4 solid 2px;
            text-decoration: none;
            font-weight: 700;
            font-family: 'Montserrat', sans-serif;
            font-size: 16px;
            text-align: center;
            max-width: max-content;
        }
        a:hover {
            background-color: #DA2DDA;
            border: #DA2DDA solid 2px;
        }
        p {
            font-family: 'Montserrat', sans-serif;
            font-size: 16px;
            color: #121012;
            line-height: 1.4;
        }
        .flex-center-item {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>
<body>
    <h3>Réinitialisation de votre mot de passe</h3>

    <p>Bonjour,</p>

    <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour le faire :</p>

    <div class="flex-center-item">
        <a href="{{ $resetUrl ?? '#' }}" target="_blank" rel="noopener noreferrer">
            Réinitialiser mon mot de passe
        </a>
    </div>
    <p>Ce lien expirera dans 1 heure.</p>

    <p>Si vous n'avez pas fait cette demande, vous pouvez ignorer cet e-mail.</p>

    <hr>
    <div class="flex-center-item">
        <small>TaskForge - Plateforme collaborative</small>
    </div>
</body>
</html>
