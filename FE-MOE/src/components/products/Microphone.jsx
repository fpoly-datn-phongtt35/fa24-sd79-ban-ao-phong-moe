// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import {
  Box,
  IconButton,
  Modal,
  ModalDialog,
  Tooltip,
  Typography,
} from "@mui/joy";
import MicTwoToneIcon from "@mui/icons-material/MicTwoTone";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { speacker } from "~/utils/speak";
import chatbot from "~/assert/images/chatbot.png";
import { useEffect, useState } from "react";

export const Microphone = ({ method }) => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (transcript) {
      if (transcript.includes("xin chào")) {
        SpeechRecognition.stopListening();
        speacker("Chào bạn, bạn muốn tìm kiếm gì").then(() => {
          resetTranscript();
          SpeechRecognition.startListening({
            continuous: true,
            language: "vi-VN",
          });
        });
      }
      setMessage(transcript.replace(/\./g, ""));
    }
  }, [transcript]);

  const handleStartListening = () => {
    method.setOpen(true);
    setMessage("");
    speacker("Bắt đầu lắng nghe").then(() => {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: "vi-VN" });
    });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    const result = transcript
      .replace(/\./g, "")
      .replace(/tôi muốn tìm kiếm/gi, "");
    const response =
      result.trim().length > 0
        ? "Đang tìm kiếm kết quả"
        : "Xin lỗi tôi không nghe rõ bạn nói gì";
    speacker(`${response} ${result}`).then(() => {
      method.setOpen(false);

      if (result.toLowerCase().includes("trạng thái")) {
        if (result.toLowerCase().includes("hết hàng")) {
          method.method.onChangeStatus("OUT_OF_STOCK");
          method.handleKeywordVoice("");
        } else if (result.toLowerCase().includes("ngừng hoạt động")) {
          method.method.onChangeStatus("INACTIVE");
        } else if (result.toLowerCase().includes("hoạt động")) {
          method.method.onChangeStatus("ACTIVE");
          method.handleKeywordVoice("");
        } else {
          method.method.onChangeStatus("ALL");
          method.handleKeywordVoice("");
        }
      } else if (result.trim().length > 0) {
        method.handleKeywordVoice(result);
        method.method.clearFilter();
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
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src="https://cdn.pixabay.com/animation/2024/01/13/23/46/23-46-52-835_512.gif"
              height={50}
            />
          </Box>
          <Typography color="white" level="body-md">
            {message}
          </Typography>
        </ModalDialog>
      </Modal>
    </Box>
  );
};
