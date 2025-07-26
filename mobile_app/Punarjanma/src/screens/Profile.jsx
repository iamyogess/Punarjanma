import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../theme/colors'; 
import Footer from '../components/Footer';
import {
  UserIcon,
  CreditCardIcon,
  LockClosedIcon,
  GlobeAltIcon,
  BellIcon,
  TrashIcon,
  QuestionMarkCircleIcon,
  DocumentIcon,
  InformationCircleIcon,
  DocumentCheckIcon,
  ChevronRightIcon,
} from 'react-native-heroicons/outline';
import ChatbotButton from '../components/ChatbotButton';

const Profile = ({ navigation }) => {
  const MenuItem = ({ Icon, label, rightText }) => (
  <TouchableOpacity style={styles.menuItem}>
    <View style={styles.menuLeft}>
      <Icon size={22} color={colors.black} />
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <View style={styles.menuRight}>
      {rightText && <Text style={styles.rightText}>{rightText}</Text>}
      <ChevronRightIcon size={20} color={colors.gray} />
    </View>
  </TouchableOpacity>
);
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Profile Header */}
        <View style={styles.profileSection}>
          <Image
            style={styles.profilePicture}
            source={{
              uri: 'https://i.pinimg.com/236x/f5/21/12/f521127cfe76995a71fa597160da220d.jpg',
            }}
          />
          <Text style={styles.name}>Aaron Ramsdale</Text>
          <Text style={styles.email}>aaronramsdale@gmail.com</Text>
        </View>

      
        <View style={styles.menuGroup}>
          <Text style={styles.sectionTitle}>Personal Info</Text>
          <MenuItem Icon={UserIcon} label="Personal Data" />
          <MenuItem Icon={CreditCardIcon} label="Payment Account" />
          <MenuItem Icon={LockClosedIcon} label="Account Security" />
        </View>

       
        <View style={styles.menuGroup}>
          <Text style={styles.sectionTitle}>General</Text>
          <MenuItem Icon={GlobeAltIcon} label="Language" />
          <MenuItem Icon={BellIcon} label="Push Notification" />
          {/* <MenuItem Icon={TrashIcon} label="Clear Cache" rightText="88 MB" /> */}
        </View>

        <View style={styles.menuGroup}>
          <Text style={styles.sectionTitle}>About</Text>
          <MenuItem Icon={QuestionMarkCircleIcon} label="Help Center" />
          <MenuItem Icon={DocumentIcon} label="Privacy & Policy" />
          <MenuItem Icon={InformationCircleIcon} label="About App" />
          <MenuItem Icon={DocumentCheckIcon} label="Term & Condition" />
        </View>
      </ScrollView>
<ChatbotButton onPress={() => navigation.navigate('Chatbot')} />
     {/* <ChatbotButton /> */}
      <Footer navigation={navigation} />
    </View>
  );
};




export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.gray50,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginTop: 8,
  },
  email: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 4,
  },
  menuGroup: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray50,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: colors.black,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    fontSize: 14,
    color: colors.gray,
    marginRight: 5,
  },
});