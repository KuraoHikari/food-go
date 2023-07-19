import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import axios from "axios";

export function SignIn() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [isErrorLogin, setisErrorLogin] = useState(false);

  const handleLogin = useCallback(
    async (payload) => {
      try {
        setIsLoading(true);
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_API_URL}/auth/local/signin`,
          {
            email: payload.email,
            password: payload.password,
          }
        );

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        navigate("/dashboard/home");
        console.log("🚀 ~ file: sign-in.jsx:33 ~ data:", data);
      } catch (error) {
        setisErrorLogin(true);
      } finally {
        setIsLoading(false);
      }
    },
    [handleSubmit]
  );
  return (
    <>
      <img
        src="https://images.unsplash.com/photo-1496412705862-e0088f16f791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="green"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Log In
            </Typography>
          </CardHeader>
          <form onSubmit={handleSubmit((d) => handleLogin(d))}>
            <CardBody className="flex flex-col gap-4">
              <Input
                type="email"
                label="Email"
                size="lg"
                color="green"
                {...register("email", { required: true })}
              />
              <Input
                type="password"
                label="Password"
                size="lg"
                color="green"
                {...register("password", { required: true })}
              />
              <div className="-ml-2.5">
                <Checkbox label="Remember Me" color="green" />
              </div>
            </CardBody>
            <CardFooter className="pt-0">
              <Button
                type="submit"
                color="green"
                variant="gradient"
                fullWidth
                disabled={isLoading}
              >
                Log In
              </Button>
              {isErrorLogin && (
                <Typography
                  variant="small"
                  className="mt-6 flex justify-center text-red-500"
                >
                  Incorrect Email or Password
                </Typography>
              )}
              <Typography variant="small" className="mt-6 flex justify-center">
                Don't have an account?
                {!isLoading ? (
                  <Link to="/auth/sign-up">
                    <Typography
                      as="span"
                      variant="small"
                      color="blue"
                      className="ml-1 font-bold"
                    >
                      Register
                    </Typography>
                  </Link>
                ) : (
                  <Typography
                    as="span"
                    variant="small"
                    color="blue"
                    className="ml-1 font-bold"
                  >
                    Register
                  </Typography>
                )}
              </Typography>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}

export default SignIn;
