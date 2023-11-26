# 概要

![実際のサイトの画像](https://github.com/haru960197/React.ts-Othello/assets/124692504/d6c0f612-436c-466b-9ecf-fce1708a1736)

ブラウザで遊べるオセロゲーム。一つの画面を二人でタップ（またはクリック）して遊んでください。  
レスポンシブデザインで、スマホでも遊べます。  
盤面のマスの数を選べることや、ひとつ前の状態に戻れることがこだわりポイントです。

TypeScriptでReactを用いた開発の練習として作成した。  
また、UIコンポーネントライブラリは使わずにCSSを記述したことでCSSの学びが深まった。

# 得られた技術的学び

- 演算子(/)は小数点以下を切り捨てない→`Math.floor()` を使用
- 関数の戻り値を`値 | null` としたとき、非nullアサーションを使えばよい。（過度な使用は危険）（使わなくてもnullかチェックしてれば大丈夫っぽい？）
- CSSで、中央に表示したいときは、
  ```
	display: flex;
	justify-content: center;
  ```
　これは、`display: flex`で、コンテナの子要素がフレックスアイテムであることを指定し、  
 `justify-content: center`で、フレックスアイテムの配置を指定している
- 主軸方向（`flex-direction`で指定）でのアイテムの並びを指定するには、
  `justify-content`  
  交差軸方向での並びは、  
  `align-items`で指定

***

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
