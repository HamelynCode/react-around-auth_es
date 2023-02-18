import Header from './Header';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Route, Switch, useHistory, withRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import MainPage from './MainPage';

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(true);

  const [cards, setCards] = useState([]);

  const history = useHistory();

  useEffect(()=>{
    api.getUserInfo()
    .then((info)=>{
      setCurrentUser(info);
      api.getInitialCards()
      .then((cards)=>{
        setCards(cards);
      })
      .catch((err) => {
        console.log(err);
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    if(isLiked){
      api.removeLike(card._id).then((newCard)=>{
        setCards(cards.map(c => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
      });
    } else {
      api.addNewLike(card._id).then((newCard)=>{
        setCards(cards.map(c => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id).then((newCard)=>{
      setCards(cards.filter(c => c._id !== card._id));
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleUpdateUser(user) {
    api.editProfile(user.name, user.about).then((info)=>{
      setCurrentUser(info);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleUpdateAvatar(data) {
    api.setProfileImage(data.avatar).then((info)=>{
      setCurrentUser(info);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleAddPlaceSubmit(place) {
    api.addNewCard(place.name, place.url).then((newCard)=>{
      setCards([newCard, ...cards]);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleRegister() {} //pasarlo a <Register>
  function handleLogin() { setLoggedIn(true); } //pasarlo a <Login>
  function handleSignout() { setLoggedIn(false); } //pasarlo a <Header>

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Switch>
          <Route path="/signin">
            <Header btnText="Sign up" linkTo="/signup" />
            <Login />
          </Route>

          <Route path="/signup">
            <Header btnText="Sign in" linkTo="/signin" />
            <Register />
          </Route>

          <Route path="/">
            <Header handleClick={handleSignout} userEmail={"email"} btnText="Sign out" linkTo="/signin" noLogo={true} />
            <ProtectedRoute loggedIn={loggedIn} component={MainPage} cards={cards} handleCardLike={handleCardLike} handleCardDelete={handleCardDelete} handleUpdateUser={handleUpdateUser} handleUpdateAvatar={handleUpdateAvatar} handleAddPlaceSubmit={handleAddPlaceSubmit} />
          </Route>
        </Switch>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default withRouter(App);