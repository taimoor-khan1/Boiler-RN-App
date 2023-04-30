import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '../../../assets/colors';
import fonts from '../../../assets/fonts';
import assets from '../../../assets/images';
import labels from '../../../assets/labels';
import styles from '../../../assets/styles';
import {HeaderTwoComponent} from '../../../components/HeaderComponents/Header2';
import {StatusBarComponent} from '../../../components/StatusBar/CustomStatusBar';
import {LinkPreview} from '@flyerhq/react-native-link-preview';
import {CustomInputComponent} from '../../../components/CustomUIComponents/CustomInput';
import {CustomButtonComponent} from '../../../components/CustomUIComponents/CustomButton';
import {useSelector, useDispatch} from 'react-redux';
import Toast from 'react-native-simple-toast';
import {
  CreateNewsMethod,
  EditNewsMethod,
} from '../../../store/actions/NewsAction';
import {add_news, edit_news} from '../../../config/apiActions';
import Spinner from 'react-native-loading-spinner-overlay';

const {width} = Dimensions.get('window');
const CreateNewsScreen = ({navigation, route}) => {
  // decalre states here
  const [newsLink, setNewsLink] = useState('');
  const [desc, setDesc] = useState(null);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [linkObject, setLinkObject] = useState(null);
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const {user} = useSelector(state => state?.Auth);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const {newsId, news_Link, news_Description} = route?.params;

  // if you are edit the new here
  useEffect(() => {
    if (newsId !== null && news_Link !== null) {
      setLink(news_Link);
      setNewsLink(news_Link);
      setDescription(news_Description);
    }
  }, []);

  // add new method here
  const addNewsMethod = () => {
    setLoader(true);
    let data = {
      action: add_news,
      news_link: newsLink,
      description: description,
      user_id: user?.id,
      link_object: JSON.stringify(linkObject),
    };
    dispatch(
      CreateNewsMethod(
        data,
        () => {
          setLoader(false);
          setLink('');
          setNewsLink('');
          navigation.navigate('TabStackScreen', {screen: 'News'});
        },
        () => {
          setLoader(false);
        },
      ),
    );
  };

  // edit news method here
  const editNewsMthod = () => {
    setLoader(true);
    let data = {
      action: edit_news,
      news_link: newsLink,
      user_id: user?.id,
      link_object: JSON.stringify(linkObject),
      id: newsId,
      description: description,
    };
    dispatch(
      EditNewsMethod(
        data,
        () => {
          setLoader(false);
          setLink('');
          setNewsLink('');
          navigation.navigate('TabStackScreen', {screen: 'News'});
        },
        () => {
          setLoader(false);
        },
      ),
    );
  };

  // render method here
  return (
    <ImageBackground
      source={assets.bgImage}
      resizeMode="cover"
      style={styless.container}>
      <StatusBarComponent
        bgColor={'transparent'}
        barStyle={labels.darkContent}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        style={styless.container}>
        <Spinner
          visible={loader}
          textContent={labels.loading}
          textStyle={[styles.color(colors.white)]}
        />
        <View style={[styles.height(40)]} />
        <HeaderTwoComponent
          text={labels.addNews}
          onPress={() => {
            navigation.goBack();
          }}
        />

        <ScrollView
          contentContainerStyle={styless.scrollContainer}
          showsVerticalScrollIndicator={false}
          style={styles.flexGrow(1)}>
          <LinkPreview
            renderLinkPreview={() => (
              <View style={styless.preViewMain}>
                <View style={styles.height(30)} />
                <View style={styless.preViewWrapper}>
                  <Image
                    source={
                      image !== undefined ? {uri: image} : assets.defaultImage
                    }
                    style={styless.topImage}
                    resizeMode="cover"
                  />
                  <View style={styless.bottomWrapper}>
                    <Text style={styless.newsTitle}>{title}</Text>
                    <Text style={styless.newsDesc}>{desc}</Text>
                  </View>
                </View>
              </View>
            )}
            text={`${newsLink}`}
            onPreviewDataFetched={data => {
              console.log('data', data);
              setDesc(data?.description);
              setImage(data?.image?.url);
              if (data?.title !== undefined) {
                setTitle(data?.title);
                setLinkObject(data);
              }
            }}
          />
          <View style={styless.inputWrapper}>
            <CustomInputComponent
              placeholder={labels.linkText}
              imageShow={false}
              Width={width / 1.2}
              value={link}
              onChange={e => {
                if (e !== '') {
                  setLink(e);
                  setNewsLink('');
                } else {
                  setLink(e);
                }
              }}
            />
          </View>

          <CustomInputComponent
            placeholder={labels.description}
            imageShow={false}
            Width={width / 1.2}
            value={description}
            onChange={e => {
              if (e !== '') {
                setDescription(e);
              } else {
                setDescription(e);
              }
            }}
            multiline={true}
            height={120}
          />
          <View style={styless.buttonWrapper}>
            <CustomButtonComponent
              onPress={() => {
                if (newsLink?.length) {
                  newsId !== null ? editNewsMthod() : addNewsMethod();
                } else {
                  if (link !== '') {
                    setNewsLink(link);
                  } else {
                    Toast.show(labels.plzFieldIsRequired);
                  }
                }
              }}
              text={
                newsLink?.length
                  ? labels.save
                  : newsId !== null
                  ? labels.editNews
                  : labels.addNews
              }
              bg={colors.theme_Color}
              width={width / 1.25}
              height={50}
            />
            <View style={styles.height(30)} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};
const styless = StyleSheet.create({
  container: {
    flex: 1,
  },
  newsTitle: {
    marginLeft: 0,
    marginTop: 20,
    fontFamily: fonts.TitilliumWebBold,
    color: colors.black,
    fontSize: 16,
    marginBottom: 10,
  },
  preViewWrapper: {
    width: width / 1.2,
    ...styles.cardShadow,
    borderRadius: 10,
    minHeight: 270,
    backgroundColor: colors.white,
  },
  preViewMain: {
    width: '100%',
    alignItems: 'center',
  },
  scrollContainer: {
    alignItems: 'center',
  },
  topImage: {
    backgroundColor: colors.orangeBlur,
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: width / 1.2,
  },
  bottomWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  newsDesc: {
    fontFamily: fonts.PoppinsRegular,
    color: colors.newsParag,
    fontSize: 16,
  },
  inputWrapper: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 15,
    marginBottom: 5,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
});
export default CreateNewsScreen;
