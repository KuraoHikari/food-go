import { Link } from "react-router-dom";
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
import { useNavigate } from "react-router-dom";

export function SignUp() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isErrorRegister, setisErrorRegister] = useState(false);
  const handleRegister = useCallback(
    async (payload) => {
      try {
        setIsLoading(true);
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_API_URL}/auth/local/signup`,
          {
            email: payload.email,
            password: payload.password,
          }
        );
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        navigate("/dashboard/home");
      } catch (error) {
        setisErrorRegister(true);
      } finally {
        setIsLoading(false);
      }
    },
    [handleSubmit, isLoading, isErrorLogin]
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
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Register
            </Typography>
          </CardHeader>
          <form onSubmit={handleSubmit((d) => handleRegister(d))}>
            <CardBody className="flex flex-col gap-4">
              <Input
                type="email"
                label="Email"
                size="lg"
                {...register("email", { required: true })}
              />
              <Input
                type="password"
                label="Password"
                size="lg"
                {...register("password", { required: true })}
              />
              <div className="-ml-2.5">
                <Checkbox label="I agree the Terms and Conditions" />
              </div>
            </CardBody>
            <CardFooter className="pt-0">
              <Button
                type="submit"
                variant="gradient"
                fullWidth
                disabled={isLoading}
              >
                Register
              </Button>
              {isErrorRegister && (
                <Typography
                  variant="small"
                  className="mt-6 flex justify-center text-red-500"
                >
                  some thing went wrong
                </Typography>
              )}
              <Typography variant="small" className="mt-6 flex justify-center">
                Already have an account?
                {!isLoading ? (
                  <Link to="/auth/sign-in">
                    <Typography
                      as="span"
                      variant="small"
                      color="green"
                      className="ml-1 font-bold"
                    >
                      Log In
                    </Typography>
                  </Link>
                ) : (
                  <Typography
                    as="span"
                    variant="small"
                    color="green"
                    className="ml-1 font-bold"
                  >
                    Log In
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

export default SignUp;
