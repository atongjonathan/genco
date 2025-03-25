import { Avatar, Banner, Button, Card, Stack } from '@nordhealth/react'
import { Toaster } from 'sonner'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import { logout } from '../services/AuthService'
import Loading from '../layout/Loading'
import { useMessage } from '../context/MessageContext'
import { useMutation } from '@tanstack/react-query'
import logo from "../../assets/favicon.png"
import { sendVerifyEmail, validateEmailUrl } from '../utils/Backend'
import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'


const Verify = () => {
    const { pUser, authuserQuery } = useAuth()
    const { useQueryHandler } = useMessage()
    const [disabled, setDisabled] = useState(false);
    const [counter, setCounter] = useState(20);
    const { showToaster } = useMessage()



    const { uidb64, token } = useParams()
    const navigate = useNavigate()

    const sendEmail = useMutation(
        {
            mutationKey: ["sendEmail"],
            mutationFn: () => {
                if (authuserQuery.data?.access_token) {
                    return sendVerifyEmail(authuserQuery.data?.access_token)
                }
                throw Error("No access token found")
            }
        }
    )
    const verifyEmail = useMutation(
        {
            mutationKey: ["verifyEmail"],
            mutationFn: () => {
                if (authuserQuery.data?.access_token) {
                    if (uidb64 && token) {

                        return validateEmailUrl(authuserQuery.data?.access_token, uidb64, token)
                    }
                    showToaster("Invalid url parameters")
                }
                throw Error("No access token found")
            }

        }
    )
    useQueryHandler(verifyEmail)
    useQueryHandler(sendEmail)

    useEffect(() => {
        const status = sendEmail.status
        if (status === "success") {
            showToaster("Email sent", "success", undefined, "Verification email sent to " + pUser.email)
            setDisabled(true)
            const countdown = setInterval(() => {
                setCounter(prev => {
                    if (prev <= 1) {
                        clearInterval(countdown)
                        setDisabled(false)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        else if (status === "error") {
            showToaster("Email not sent", "danger", undefined, "Please try again later. If the issue persists, contact support")

        }


    }, [sendEmail.status])
    useEffect(() => {
        const status = verifyEmail.status
        if (status === "success") {
            showToaster("Email verified", "success", undefined)
            window.location.assign("/app")
        }
        else if (status === "error") {
            let error = verifyEmail.error as AxiosError
            let response = error.response
            if (response) {
                let data = response.data as { error: string }
                let message = data.error
                if (message !== "This link is invalid.") {
                    showToaster("Email verification failed.", "danger", undefined, "Please try again later. If the issue persists, contact support")

                }

            }

            else {
                showToaster("Email verification failed.", "danger", undefined, "This link has already been used or expired")

            }



        }


    }, [verifyEmail.status])


    useEffect(() => {
        if (uidb64 && token) {

            verifyEmail.mutate()


        }

    }, [uidb64, token])


    return (
        <>
            {
                verifyEmail.isLoading ? (
                    <Loading />
                ) :
                    (
                        <main className="n-reset n-stack-horizontal login">

                            <Toaster closeButton />
                            <Stack style={{
                                inlineSize: '90%',
                                maxInlineSize: '400px',
                                margin: 'var(--n-space-xxl) auto',
                                backgroundColor: 'var(--n-color-background)'
                            }}>        {disabled && counter > 0 && <Banner variant='info'>Please wait {counter} seconds to try again.</Banner>}

                                <Card padding="l">
                                    <div className="logo" slot="header">
                                        <Avatar className='n-color-background' size="l" variant='square' name="Peri Bloom" src={logo}>PB
                                        </Avatar>
                                        <p>Verify your email</p>
                                    </div>
                                    <Stack>
                                        <p>We will send an email to <span className='font-semibold'>{pUser?.email}</span></p>
                                        <p>Follow the link to activate your account</p>
                                        <Button
                                            loading={sendEmail.isLoading}
                                            onClick={() => sendEmail.mutate()}
                                            variant='primary'
                                            expand
                                            disabled={disabled}
                                        >
                                            {disabled ? `Wait ${counter}s` : "Send email"}
                                        </Button>
                                        <Button onClick={logout}>Logout</Button>

                                    </Stack>

                                </Card>
                            </Stack>
                        </main>)
            }
        </>



    )
}

export default Verify
