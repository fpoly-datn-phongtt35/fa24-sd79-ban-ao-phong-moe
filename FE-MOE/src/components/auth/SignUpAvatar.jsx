import { Box, Button, Typography } from "@mui/joy";
import { useContext } from "react";
import { AuthContext } from "~/context/AuthContext";

function SignUpAvatar() {
  const context = useContext(AuthContext);
  return (
    <form style={{ width: "100%", maxWidth: 400 }}>
      <Typography
        level="h4"
        marginBottom={3}
        textAlign="center"
        fontWeight="bold"
      >
        ẢNH ĐẠI DIỆN
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          mt: 2,
        }}
      >
        <Button
          type="button"
          variant="soft"
          color="neutral"
          sx={{ width: "45%" }}
          onClick={() => context.setStep(2)}
        >
          Quay lại
        </Button>
        <Button
          type="submit"
          variant="soft"
          color="neutral"
          sx={{ width: "45%" }}
        >
          Tiếp tục
        </Button>
      </Box>
    </form>
  );
}

export default SignUpAvatar;
