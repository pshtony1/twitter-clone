# Twitter Clone | React Project

`React`와 `Firebase`로 만드는 SNS 클론 프로젝트

<br />

[프로젝트 링크](https://pshtony1.github.io/twitter-clone/)

<img src="https://user-images.githubusercontent.com/67461578/110203648-ac01a700-7eb2-11eb-908e-d225c2b66484.png" width="50%" /><img src="https://user-images.githubusercontent.com/67461578/110203647-aad07a00-7eb2-11eb-9a6e-4585d0cd8e7c.png" width="50%" />

---

<br />

## 1. 스택

* **Front-end**

<img src="https://img.shields.io/badge/React-1f232a?style=flat-square&logo=React&logoColor=60dafb" height="24"/>&nbsp;<img src="https://img.shields.io/badge/Node.js-1f232a?style=flat-square&logo=Node.js&logoColor=3c873a" height="24"/>&nbsp;<img src="https://img.shields.io/badge/Sass-1f232a?style=flat-square&logo=Sass&logoColor=cc6699" height="24"/>

* **Back-end**

<img src="https://img.shields.io/badge/Firebase-1f232a?style=flat-square&logo=Firebase&logoColor=ffcb2d" height="24"/>

<br />

## 2. 기능
이하는 현재 모두 구현된 기능들이다.  
Real-Time 적용이 지원되는 항목은 `R`이 붙는다.

### 2 - 1. 계정 및 인증 🔐
* 로그인/회원가입

* 소셜 로그인
  * Google
  * Github
 
### 2 - 2. 유저 👱‍♂️
* Display name 수정 - `R`

* Profile photo 업로드/삭제 - `R`

* 작성한 트윗들 모아보기

### 2 - 3. 트윗 💦
* 트윗 작성 및 사진 업로드 - `R`

* 트윗 수정 및 삭제 - `R`

* 좋아요 기능 - `R`

<br />

## 2.5. 추가 목표
- [ ] 댓글 구현
- [ ] 친구 추가
- [ ] 사용자 알림 구현
- [ ] @ 로 사용자 트윗

<br />

## 3. 문제 및 해결

### 🙉 트윗 로딩이 너무 부자연스럽다.

용량이 큰 사진들은 로딩에 상대적으로 긴 시간이 걸리기에, 사진을 불러오는동안 사용자가 해당 영역에 사진이 없다고 착각할 수 있는 문제가 있었다.

#### ✔ 스켈레톤(Skeleton) 로딩을 적용하였다.
![skeleton](https://user-images.githubusercontent.com/67461578/110205868-e1f85880-7ebd-11eb-9ac0-a3cb6d79ad06.gif)

`InterSectionObserver`를 이용해 `lazy-loading`을 구현할까 생각했지만, 스켈레톤 로딩을 적용하는 것이 이 문제를 해결하는데 더 적합하다고 판단했다. 

1. 아래와 같이 스켈레톤의 뼈대가 될 컴포넌트를 만들었다.

```js
const TweetSkeleton = ({ attachmentURL, attachmentHeight }) => {
  return (
    <div className="skeleton__tweet-container">
      <div className="skeleton__tweet-header">
        <div className="skeleton__user-img"></div>
    
    ... 중략
    
    </div>
  );
};
```

2. 스켈레톤의 뼈대에 스타일을 적용했다.

```scss
.skeleton__tweet-container {
  width: 100%;

  .skeleton__tweet-header {
    width: 100%;
    margin-bottom: 15px;
    display: flex;
      
... 이하 생략

```

3. `new Image()` 를 이용해 미리 이미지를 불러오고, `onload` 이벤트를 이용해 state를 조작하여 스켈레톤 로딩을 온/오프했다.

<br />

### 🙉 특정 submit 이벤트들에서 다중 submit의 가능성이 존재했다.

예를 들어, 로그인/회원가입 로직(비동기 처리)이 작동중임에도,  
중복해서 로그인/회원가입 로직을 실행시킬 수 있었다.

#### ✔ 비동기 처리 로직에 비활성화/로딩 기능을 추가했다.

![loading3](https://user-images.githubusercontent.com/67461578/110206566-d4dd6880-7ec1-11eb-90c8-15b6cc7a4562.gif)

비동기 처리 로직이 시작될 때와 끝날 때, state를 toggle하여 submit target을 비활성화 시키고 로딩 컴포넌트를 렌더링했다.

<br />

### 🙉 트윗의 글자 수가 매우 크면 트윗 컴포넌트가 차지하는 크기가 매우 커졌다.

트윗에 적을 수 있는 최대 글자 수는 1000글자였는데, 트윗의 모든 글을 한 번에 다 보여주면 컴포넌트의 높이가 매우 커질 수 있었다.

#### ✔ 특정 글자 수 이상의 트윗은 '더보기' 기능을 추가해 높이를 조절했다.

![more1](https://user-images.githubusercontent.com/67461578/110207732-d2cad800-7ec8-11eb-845f-8e31e14af8c4.gif)
