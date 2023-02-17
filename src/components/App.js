import ImagePopup from './ImagePopup';
import PopupWithForm from './PopupWithForm';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { Route, Switch, withRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  //const [loggedIn, setLoggedIn] = useState(false);

  const [cards, setCards] = useState([]);

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

  function handleEditAvatarClick(){
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick(){
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick(){
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups(){
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setSelectedCard({});
  }

  function handleCardClick(card){
    setIsImagePopupOpen(true);
    setSelectedCard(card);
  }

  function handleUpdateUser(user) {
    api.editProfile(user.name, user.about).then((info)=>{
      setCurrentUser(info);
    })
    .catch((err) => {
      console.log(err);
    });
    closeAllPopups();
  }

  function handleUpdateAvatar(data) {
    api.setProfileImage(data.avatar).then((info)=>{
      setCurrentUser(info);
    })
    .catch((err) => {
      console.log(err);
    });
    closeAllPopups();
  }

  function handleAddPlaceSubmit(place) {
    api.addNewCard(place.name, place.url).then((newCard)=>{
      setCards([newCard, ...cards]);
    })
    .catch((err) => {
      console.log(err);
    });
    closeAllPopups();
  }

  return (
    <div className="page">
      <Header />
      <Switch>

        <Route path="/login">
          <Login />
        </Route>

        <Route path="/register">
          <Register />
        </Route>

        <ProtectedRoute path="/" loggedIn={false}>
          <CurrentUserContext.Provider value={currentUser}>
            <ImagePopup selectedCard={selectedCard} isOpen={isImagePopupOpen} onClose={closeAllPopups} />
            <PopupWithForm id='form-delete' title='Estas seguro/a ?' isOpen={false} onClose={closeAllPopups} containerClass='form__body_confirm' submitText='Sí' />
            <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
            <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>
            <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit}/>
            <Main onEditProfileClick={handleEditProfileClick} onAddPlaceClick={handleAddPlaceClick} onEditAvatarClick={handleEditAvatarClick} onCardClick={handleCardClick} cards={cards} onCardLike={handleCardLike} onCardDelete={handleCardDelete} />
            <Footer />
          </CurrentUserContext.Provider>
        </ProtectedRoute>

      </Switch>
    </div>
  );
}

export default withRouter(App);
