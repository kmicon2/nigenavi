<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>NigeNavi</title>

  <link rel="stylesheet" href="css/style.css" />
</head>

<body>

  <div class="header">
    <h1>NigeNavi</h1>
    <div id="locationStatus">位置情報取得中</div>
  </div>

  <div class="transport-group">
    <button class="transport-button active" data-mode="walk">徒歩</button>
    <button class="transport-button" data-mode="bike">自転車</button>
    <button class="transport-button" data-mode="car">車</button>
  </div>

  <div class="actions">
    <button id="searchButton">検索</button>
    <button id="routeButton">ルート</button>
  </div>

  <div id="resultList"></div>

  <script src="js/location.js"></script>
  <script src="js/search.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/app.js"></script>

</body>
</html>