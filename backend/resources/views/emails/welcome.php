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
    <h3>Bienvenue sur TaskForge {{ $prenom }} {{ $nom }} !</h3>

    <p>Merci de vous être inscrit sur TaskForge.</p>
    <p>Vous pouvez maintenant créer ou rejoindre vos projets.</p>

    <hr>
    <div class="flex-center-item">
        <small>TaskForge - Plateforme collaborative</small>
    </div>
</body>
</html>
