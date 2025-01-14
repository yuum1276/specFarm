import {
  Button,
  Checkbox,
  createTheme,
  FormControlLabel,
  Grid,
  rgbToHex,
  styled,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../app-config";
import SocialLogin from "../components/login/SocialLogin";
import styles from "../styles/login/Login.module.css";
import { useBeforeRender } from "../utils";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    green: {
      main: "#1d5902",
      contrastText: "#fff",
    },
  },
});

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#8cbf75",
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#8cbf75",
    },
  },
});

const Login = ({ pathname }) => {
  useBeforeRender(() => {
    document.getElementsByTagName("body")[0].style.overflowY = "auto";
  }, []);

  const navigate = useNavigate();
  const [idError, setIdError] = useState(false);
  const [pwError, setPwError] = useState(false);

  const [userId, setUserId] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["rememberUserId"]);
  const [isRemember, setIsRemember] = useState(false);

  useEffect(() => {
    setUserId(cookies.rememberUserId);
    if (cookies.rememberUserId !== undefined) {
      setIsRemember(true);
    }
  }, []);

  // Id Check
  const idCheck = useCallback(
    (e) => {
      if (userId === null || userId === "") {
        setIdError(true);
      } else {
        setIdError(false);
        setUserId(userId);
      }
    },
    [userId]
  );

  const idErrorReset = useCallback((e) => {
    setIdError(false);
  });

  // Password Validation Check
  const pwCheck = useCallback((e) => {
    const userPw = e.target.value;

    if (userPw === null || userPw === "") {
      setPwError(true);
    } else {
      setPwError(false);
    }
  }, []);

  const pwErrorReset = useCallback((e) => {
    setPwError(false);
  });

  // login submit
  const loginSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const userPw = data.get("userPw");

    if (userId === null || userId === "") {
      setIdError(true);
    }

    if (userPw === null || userPw === "") {
      setPwError(true);
    }

    if (!idError && userId !== "" && !pwError && userPw !== "") {
      axios({
        method: "post",
        url: API_BASE_URL + "/user/login",
        data: { userId: userId, userPw: userPw },
      }).then((response) => {
        if (response.data.token) {
          document.getElementById("loginFailAlert").hidden = true;
          sessionStorage.setItem("ACCESS_TOKEN", response.data.token);
          if (isRemember) {
            setCookie("rememberUserId", userId);
          } else {
            removeCookie("rememberUserId");
          }
          navigate(pathname || "/");
        } else {
          document.getElementById("loginFailAlert").hidden = false;
        }
      });
    }
  };

  return (
    <div className={styles.center} style={{ background: "rgb(250, 250, 250)" }}>
      <div className={styles.form}>
        <div className={styles.logo}>
          <NavLink to="/">specFarm</NavLink>
        </div>
        <p className={styles.title}>로그인</p>
        <form onSubmit={loginSubmit}>
          <Grid container spacing={3} className={styles.padding}>
            <Grid item xs={12}>
              <CssTextField
                name="userId"
                variant="outlined"
                id="userId"
                label="아이디"
                fullWidth
                onBlur={idCheck}
                error={idError}
                onFocus={idErrorReset}
                inputProps={{
                  style: {
                    paddingTop: "11px",
                    paddingBottom: "11px",
                  },
                }}
                InputLabelProps={{
                  style: {
                    lineHeight: "100%",
                  },
                }}
                value={userId || ""}
                onChange={(e) => {
                  setUserId(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <CssTextField
                name="userPw"
                type="password"
                variant="outlined"
                id="userPw"
                label="비밀번호"
                fullWidth
                onBlur={pwCheck}
                error={pwError}
                onFocus={pwErrorReset}
                inputProps={{
                  style: {
                    paddingTop: "11px",
                    paddingBottom: "11px",
                  },
                }}
                InputLabelProps={{
                  style: {
                    lineHeight: "100%",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                onChange={(e) => {
                  setIsRemember(e.target.checked);
                }}
                control={
                  <Checkbox
                    size="small"
                    style={{ paddingTop: "0px", paddingBottom: "0px" }}
                    checked={isRemember}
                    icon={
                      <CheckCircleOutlineIcon
                        color="disabled"
                        fontSize="medium"
                      />
                    }
                    checkedIcon={
                      <CheckCircleIcon color="success" fontSize="medium" />
                    }
                  />
                }
                label="아이디 저장"
                sx={{
                  ".MuiFormControlLabel-label": {
                    fontSize: "14px",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} style={{ textAlign: "center", paddingTop: "0" }}>
              <p
                className={styles.font15}
                style={{
                  color: "#e53e3e",
                  background: "rgba(229, 62, 62, 0.1)",
                  padding: "10px",
                  lineHeight: "150%",
                  marginTop: "24px",
                }}
                id="loginFailAlert"
                hidden
              >
                아이디 혹은 비밀번호가 일치하지 않습니다.
                <br />
                입력한 내용을 다시 확인해 주세요.
              </p>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                type="submit"
                theme={theme}
                color="green"
                className={styles.buttonMiddle}
                fullWidth
                style={{
                  fontSize: "16px",
                  lineHeight: "18px",
                  padding: "12px 16px",
                }}
              >
                로그인
              </Button>
            </Grid>
          </Grid>
          <div className={styles.padding}>
            <div
              className={styles.aTagDiv}
              style={{ textAlign: "center", marginTop: "24px" }}
            >
              <Link to="/findUser">계정정보 찾기</Link>
              <Link to="/join" style={{ marginLeft: "50px" }}>
                회원가입
              </Link>
            </div>
            <div className={styles.snsLogin}>
              <p>SNS계정으로 간편 로그인/회원가입</p>
              <div className={styles.snsLoginIcon}>
                <SocialLogin />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
