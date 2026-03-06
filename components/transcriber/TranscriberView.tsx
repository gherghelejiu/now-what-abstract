import { useAuthGuard } from "@/providers/auth-guard";
import { useAction, useMutation, useQuery } from "convex/react";
import { Audio } from 'expo-av';
import React, { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { api } from "../../convex/_generated/api";
import Dropdown, { DropdownOption } from "../ui/dropdown";
import RecordButton from "../ui/record-button";

export default function TranscriberView({ onCreateDoc, onLogin }: {
  onCreateDoc: () => void;
  onLogin: () => void;
}) {

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { user } = useAuthGuard();
  console.log('user: ', JSON.stringify(user));

  const documents = useQuery(
    api.documents.getDocumentsByUser,
    user ? { userId: user._id } : 'skip'
  );
  // console.log('docs: ', JSON.stringify(documents))
  const currentDocument = useQuery(
    api.documents.getDocumentById,
    user?.currentDocumentId ? { documentId: user.currentDocumentId } : 'skip'
  );
  // console.log('current doc: ', JSON.stringify(currentDocument));
  const dropdownOptions: DropdownOption<any>[]  = documents ? documents.map((doc) => ({ label: doc.title, value: doc})) : [];
  const dropdownSelection = currentDocument ? currentDocument._id : undefined;
  // {
  //   label: currentDocument.title,
  //   value: currentDocument as any,
  // } as DropdownOption : null;
  // console.log('dropdown selection: ', JSON.stringify(dropdownSelection));


  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const saveTranscription = useMutation(api.transcriptions.saveTranscription);
  const updateDocId = useMutation(api.documents.setCurrentDocId);

  const transcribeAudio = useAction(api.transcribe.transcribeAudio);


  const handleDocSelection = (option: DropdownOption) => {
    updateDocId({
      userId: user._id,
      docId: option.value._id || '',
    });
    console.log('doc selected: ', JSON.stringify(option));
  }

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        alert('Permission to access microphone is required!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);

      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    setIsRecording(false);
    setIsProcessing(true);

    try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);

        if (!uri) {
          throw new Error('No recording URI');
        }

        // await handleAudioProcessing(uri);
        await handleAudioProcessingMock(uri);
        // 
    } catch (error) {
        console.error('Error processing audio:', error);
        alert('Failed to transcribe audio');
    } finally {
        setIsProcessing(false);
    }
  }

  async function handleAudioProcessingMock(uri: string) {
      console.log('handling audio processing mock...');
      await new Promise(resolve => setTimeout(resolve, 3500));
      setTranscription('random test text to mock the transcription');
      console.log('finished mock audio processing.');
  }

  async function handleAudioProcessing(uri: string) {

      // Upload to Convex storage
      const uploadUrl = await generateUploadUrl();
      
      const response = await fetch(uri);
      const blob = await response.blob();

      const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': blob.type },
          body: blob,
      });

      const { storageId } = await uploadResponse.json();

      // Transcribe the audio
      const text = await transcribeAudio({ storageId });

      setTranscription(text);

      await saveTranscription({
          audioStorageId: storageId,
          text,
          documentId: currentDocument?._id || '',
          index: 0, // todo
      });
  }

  return (
    <View style={[styles.container]}>
        <View style={styles.infoContent}>
          <Dropdown options={dropdownOptions} 
              selectedValue={dropdownSelection} 
              onSelect={handleDocSelection}/>

          { user ? <View style={{
            gap: 6,
          }}>
            <Text style={{
              color: 'white',
            }}>{user.isAnonymous ? `Anonymous User ${user._id}` : `User: ${user._id}`}</Text>
            {user.isAnonymous ? <Button title={'Login/Register'} onPress={onLogin}/> : null}
            <Text style={{
              color: 'white',
            }}>{`Minutes left: ${user.minutesLeft | 0}`}</Text>
          </View> : null}
        </View>

        <View style={styles.recordContent}>
            {isProcessing && (
                <View style={styles.processingContainer}>
                    <ActivityIndicator size="large" />
                    <Text style={styles.processingText}>Transcribing...</Text>
                </View>
            )}
          
            {transcription ? (
                <View style={styles.transcriptionContainer}>
                    <Text style={styles.label}>Transcription:</Text>
                    <Text style={styles.transcription}>{transcription}</Text>
                </View>
            ) : null}

            <RecordButton
                  isRecording={isRecording} 
                  isProcessing={isProcessing} 
                  onPress={isRecording ? stopRecording : startRecording}/>
                  {/* onPress={isRecording ? () => {} : () => {}}/> */}
              
              {/* <Button
                title={isRecording ? 'Stop Recording' : 'Start Recording'}
                onPress={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
              /> */}
            
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    // padding: 20,
  },
  infoContent: {
    paddingTop: 80,
    paddingStart: 30,
    paddingEnd: 30,
    paddingBottom: 30,
    flex: 1,
    width: '100%',
    // backgroundColor: 'red',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  recordContent: {
    // backgroundColor: 'red',
    paddingBottom: 180,
    paddingEnd: 50,
    paddingStart: 30,
    paddingTop: 100,
    alignItems: 'flex-end',
  },
  processingContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  processingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  transcriptionContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  transcription: {
    fontSize: 16,
    lineHeight: 24,
  },
});