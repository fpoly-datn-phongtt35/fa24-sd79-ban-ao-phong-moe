import {
  Box,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Modal,
  ModalDialog,
  Tooltip,
  Typography,
} from "@mui/joy";
import MicTwoToneIcon from "@mui/icons-material/MicTwoTone";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { speacker } from "~/utils/speak";
import chatbot from "~/assert/chatbot.png";

export const Microphone = ({ method }) => {
  const { transcript, resetTranscript } = useSpeechRecognition();

  const handleStartListening = () => {
    method.setOpen(true);
    speacker("Bắt đầu lắng nghe").then(() => {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: "vi-VN" });
    });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    const result = transcript.replace(/\./g, "");
    const response =
      result.trim().length > 0
        ? "Đang tìm kiếm kết quả"
        : "Xin lỗi tôi không nghe rõ bạn nói gì";
    speacker(`${response} ${result}`).then(() => {
      method.setOpen(false);
      if (result.trim().length > 0) {
        method.handleKeywordVoice(result);
      }
    });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Tooltip title="Tìm kiếm bằng giọng nói" variant="plain">
        <IconButton onClick={handleStartListening}>
          <MicTwoToneIcon />
        </IconButton>
      </Tooltip>
      <Modal open={method.open} onClose={handleStopListening}>
        <ModalDialog variant="solid">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={chatbot} alt="ChatBot" />
          </Box>
          <Box>
            <LinearProgress thickness={1} />
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
};
