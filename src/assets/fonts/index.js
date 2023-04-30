import {Platform} from 'react-native';

const fonts = {
  TitilliumWebBlack:
    Platform.OS === 'ios' ? 'TitilliumWeb-Black' : 'TitilliumWeb-Black',
  TitilliumWebBold:
    Platform.OS === 'ios' ? 'TitilliumWeb-Bold' : 'TitilliumWeb-Bold',
  TitilliumWebRegular:
    Platform.OS === 'ios' ? 'TitilliumWeb-Regular' : 'TitilliumWeb-Regular',
  TitilliumWebSemiBold:
    Platform.OS === 'ios' ? 'TitilliumWeb-SemiBold' : 'TitilliumWeb-SemiBold',
    PoppinsSemiBold:
    Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
    PoppinsBold:
    Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    PoppinsBlack:
    Platform.OS === 'ios' ? 'Poppins-Black' : 'Poppins-Black',
    PoppinsMedium:
    Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium',
    PoppinsSemiBold:
    Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
    PoppinsRegular:
    Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
};
export default fonts;
