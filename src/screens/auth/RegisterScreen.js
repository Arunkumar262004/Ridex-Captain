import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';

import colors from '../../constants/colors';

import { registerUser } from '../../services/api/authApi';
import { loginSuccess } from '../../app/store/slices/authSlice';
import { saveAuthData } from '../../utils/storage';

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);

  // KYC & Personal Info
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [aadharNo, setAadharNo] = useState('');

  // Vehicle Details
  const [vehicleNo, setVehicleNo] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('Honda');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleCategory, setVehicleCategory] = useState('Bike');
  const [isGear, setIsGear] = useState(false); // false = Non-Gear, true = Gear

  const handleAadharChange = (text) => {
    const numeric = text.replace(/\D/g, '').slice(0, 12);
    setAadharNo(numeric);
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter your full name.');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Validation', 'Please enter your mobile number.');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Validation', 'Please enter your email.');
      return;
    }

    if (aadharNo.length !== 12) {
      Alert.alert('Validation Error', 'Aadhar card number must be strictly 12 numeric digits.');
      return;
    }

    if (!vehicleNo.trim()) {
      Alert.alert('Validation', 'Please enter your vehicle registration number.');
      return;
    }

    if (!vehicleModel.trim()) {
      Alert.alert('Validation', 'Please enter your vehicle model (e.g. Activa 6G / Pulsar).');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation', 'Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation', 'Passwords do not match.');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        password,
        aadharNo,
        vehicleNo: vehicleNo.trim().toUpperCase(),
        vehicleBrand,
        vehicleModel: vehicleModel.trim(),
        vehicleCategory,
        isGear,
        status: 'PENDING_VERIFICATION',
        source: 'App Self Registration',
      };

      const response = await registerUser(payload);
      const authData = response.data || response;
      const token = authData.token || 'CAPTAIN_TOKEN_' + Date.now();
      const user = authData.user || { name, email, role: 'CAPTAIN', status: 'PENDING_VERIFICATION' };

      await saveAuthData({ token, user });
      dispatch(loginSuccess({ token, user }));

      Alert.alert(
        'Registration Submitted',
        'Your captain KYC registration has been submitted successfully! Your account is currently in PENDING VERIFICATION status awaiting Admin approval.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to create captain account.';
      Alert.alert('Registration Failed', message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Register as Captain</Text>
        <Text style={styles.subtitle}>
          Enter your KYC details & vehicle information to join the Ridex fleet.
        </Text>

        <View style={styles.form}>
          <Text style={styles.sectionHeader}>1. Personal & KYC Information</Text>
          <AppInput label="Full Name" value={name} onChangeText={setName} placeholder="e.g. Suresh Kumar" />
          <AppInput label="Mobile Number" value={phone} onChangeText={setPhone} placeholder="Enter 10-digit mobile number" keyboardType="phone-pad" />
          <AppInput label="Email" value={email} onChangeText={setEmail} placeholder="Enter email" keyboardType="email-address" />
          <AppInput
            label="Aadhar Card Number (12 Digits Only)"
            value={aadharNo}
            onChangeText={handleAadharChange}
            placeholder="Enter 12 digit Aadhar no"
            keyboardType="number-pad"
            maxLength={12}
          />

          <Text style={styles.sectionHeader}>2. Vehicle Details</Text>
          <AppInput label="Vehicle Registration No" value={vehicleNo} onChangeText={setVehicleNo} placeholder="e.g. TN 01 AB 1234" />
          <AppInput label="Vehicle Brand" value={vehicleBrand} onChangeText={setVehicleBrand} placeholder="e.g. Honda / Hero / TVS" />
          <AppInput label="Vehicle Model" value={vehicleModel} onChangeText={setVehicleModel} placeholder="e.g. Activa 6G / Pulsar 150" />

          <Text style={styles.inputLabel}>Vehicle Transmission Type</Text>
          <View style={styles.radioRow}>
            <TouchableOpacity
              style={[styles.radioButton, !isGear && styles.radioSelected]}
              onPress={() => setIsGear(false)}
            >
              <Text style={[styles.radioText, !isGear && styles.radioTextSelected]}>Non-Gear (Scooter/Auto)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, isGear && styles.radioSelected]}
              onPress={() => setIsGear(true)}
            >
              <Text style={[styles.radioText, isGear && styles.radioTextSelected]}>Gear (Motorcycle/Car)</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeader}>3. Account Security</Text>
          <AppInput label="Password" value={password} onChangeText={setPassword} placeholder="Create password" secureTextEntry />
          <AppInput label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm password" secureTextEntry />

          <AppButton title="Submit KYC & Register" onPress={handleRegister} loading={loading} />

          <View style={styles.loginRow}>
            <Text style={styles.loginLabel}>Already registered?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 20,
    color: '#64748B',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 4,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    marginTop: 10,
  },
  radioRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  radioButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  radioSelected: {
    borderColor: '#0284C7',
    backgroundColor: '#E0F2FE',
  },
  radioText: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '600',
  },
  radioTextSelected: {
    color: '#0284C7',
    fontWeight: '700',
  },
  form: {
    width: '100%',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loginLabel: {
    color: '#64748B',
    fontSize: 14,
  },
  loginText: {
    marginLeft: 6,
    color: '#0284C7',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default RegisterScreen;