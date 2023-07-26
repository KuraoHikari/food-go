import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Typography,
  Tooltip,
  Button,
  DialogHeader,
  Dialog,
  DialogFooter,
  DialogBody,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { BanknotesIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { createShop, fetchShops } from "@/api/shop";
import { refreshAccessToken } from "@/api/auth";
import { useForm } from "react-hook-form";

export function PageShops() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [createShopDialog, setCreateShopDialog] = useState(false);

  const handleOpen = useCallback(() => {
    reset();
    setCreateShopDialog(!createShopDialog);
  }, [createShopDialog]);

  const handleCreateShop = async (payload) => {
    try {
      const data = await createShop(payload);
      setShops([data, ...shops]);

      handleOpen();
    } catch (error) {}
  };

  useEffect(() => {
    async function fetchData() {
      const accessToken = localStorage.getItem("access_token");
      let fetchDataShop;
      try {
        fetchDataShop = await fetchShops(accessToken);

        setShops(fetchDataShop);
      } catch (error) {
        if (error.response.data.message === "Unauthorized") {
          try {
            const refreshToken = localStorage.getItem("refresh_token");
            const data = await refreshAccessToken(refreshToken);
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
            fetchDataShop = await fetchShops(data.access_token);
            setShops(fetchDataShop);
          } catch (error) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            navigate("/auth/sign-in");
          }
        } else {
        }
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Dialog open={createShopDialog} size={"md"} handler={handleOpen}>
        <form onSubmit={handleSubmit(handleCreateShop)}>
          <DialogHeader>Create Shop</DialogHeader>
          <DialogBody divider className="mb-4 flex flex-col gap-6">
            <Input
              type="text"
              label="Name"
              size="lg"
              {...register("name", { required: true })}
            />

            <Input type="file" label="Logo" size="lg" {...register("file")} />
            <Input
              type="text"
              label="Location"
              size="lg"
              {...register("location", { required: true })}
            />
            <Input
              type="text"
              label="phoneNumber"
              size="lg"
              {...register("phoneNumber", { required: true })}
            />
            <Textarea
              label="description"
              {...register("desc", { required: true })}
            />
          </DialogBody>

          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => handleOpen()}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="green" type="submit">
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url(https://images.unsplash.com/photo-1518522772213-78b1085b76d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80)] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-blue-500/50" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4">
        <CardBody className="p-4">
          <div className="px-4 pb-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Projects
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-500"
                >
                  Architects design houses
                </Typography>
              </div>
              <div>
                <Button size="sm" onClick={() => handleOpen()}>
                  Add Shop
                </Button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
              {shops.map(({ id, name, desc }) => (
                <Card key={id} color="transparent" shadow={false}>
                  <CardHeader
                    floated={false}
                    color="gray"
                    className="mx-0 mt-0 mb-4 h-64 xl:h-40"
                  >
                    <img
                      src={"/img/home-decor-1.jpeg"}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                    {/* <IconButton
                        size="sm"
                        color="red"
                        variant="text"
                        className="!absolute top-4 right-4 rounded-full"
                      >
                        <HeartIcon className="h-6 w-6" />
                      </IconButton> */}
                  </CardHeader>
                  <CardBody className="py-0 px-1">
                    {/* <Typography
                        variant="small"
                        className="font-normal text-blue-gray-500"
                      >
                        {tag}
                      </Typography> */}
                    <Typography
                      variant="h5"
                      color="blue-gray"
                      className="mt-1 mb-2"
                    >
                      {name}
                    </Typography>
                    <Typography
                      variant="small"
                      className="font-normal text-blue-gray-500"
                    >
                      {desc}
                    </Typography>
                    <div className="group mt-8 inline-flex flex-wrap items-center gap-3">
                      <Tooltip content="$129 per night">
                        <span className="cursor-pointer rounded-full border border-blue-500/5 bg-blue-500/5 p-3 text-blue-500 transition-colors hover:border-blue-500/10 hover:bg-blue-500/10 hover:!opacity-100 group-hover:opacity-70">
                          <BanknotesIcon className="h-5 w-5" />
                        </span>
                      </Tooltip>
                    </div>
                  </CardBody>
                  <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
                    <Link to={"/"}>
                      <Button variant="outlined" size="sm">
                        view shop
                      </Button>
                    </Link>
                    <div>
                      {/* {members.map(({ img, name }, key) => (
                          <Tooltip key={name} content={name}>
                            <Avatar
                              src={img}
                              alt={name}
                              size="xs"
                              variant="circular"
                              className={`cursor-pointer border-2 border-white ${
                                key === 0 ? "" : "-ml-2.5"
                              }`}
                            />
                          </Tooltip>
                        ))} */}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default PageShops;
