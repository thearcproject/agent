import React from 'react'
import { graphql, compose } from 'react-apollo'
import style from '../base.css'
import {Icons, Panel} from 'oce-components/build'
import { withFormik, Form, Field } from 'formik'
import * as Yup from 'yup'
import Alert from '../components/alert'
import LoginMutation from '../mutations/login'
import updateNotification from "../mutations/updateNotification";

const Login = ({values, handleSubmit, touched, errors}) => {
      return (
          <div className={style.login_wrapper}>
            <div className={style.wrapper_title}>
              <h3><span aria-label='emoji' role='img'>🧙</span> agent.</h3>
              <h4>Your events - networked</h4>
            </div>
            <div className={style.login_container}>
            <Panel title='login' icon={<Icons.Power width='18' height='18' color='#f0f0f0' />}>
              <Form>
                  <div>
                      <Field placeholder='Insert your username' name='username' />
                      { touched.username && errors.username && <Alert>{errors.username}</Alert> }
                  </div>
                  <div>
                      <Field placeholder='Insert your password' name='password' type='password' />
                      { touched.password && errors.password && <Alert>{errors.password}</Alert> }
                  </div>
              <button>login</button>
              </Form>
              <a href='https://ocp.freedomcoop.eu/account/password/reset/' target='blank' className={style.wrapper_lost}>Password lost?</a>
              <h5>Useful links</h5>
              <ul>
                  <li><a href='https://www.opencoopecosystem.net' target='blank'>Documentation</a></li>
                  <li><a href='https://t.me/ocewelcome' target='blank'>Telegram</a></li>
                  <li><a href='https://github.com/opencooperativeecosystem' target='blank'>Github</a></li>
              </ul>
            </Panel>
          </div>
        </div>
    )
  }

export default compose(
    graphql(LoginMutation),
    graphql(updateNotification, {name: 'updateNotification'}),
    withFormik({
        mapPropsToValues: () => ({ username: '', password: '' }),
        validationSchema: Yup.object().shape({
           username: Yup.string().required(),
           password: Yup.string().min(4).required()
        }),
        handleSubmit: (values, {props, resetForm, setErrors, setSubmitting}) => {
            props.mutate({variables: {username: values.username, password: values.password}})
            .then ((res) => {
              props.updateNotification({variables: {
                  message: <div className={style.message}><span><Icons.Bell width='18' height='18' color='white' /></span>Welcome :)</div>,
                  type: 'success'
              }
              })
              localStorage.setItem('oce_token', res.data.createToken.token)
              localStorage.setItem('agent_id', res.data.createToken.id)
              props.history.replace('/')
            }, 
            (e) => {
                const errors = e.graphQLErrors.map(error => error.message)
                props.updateNotification({variables: {
                    message: <div className={style.message}><span><Icons.Cross width='18' height='18' color='white' /></span>{errors}</div>,
                    type: 'alert'
                }
                })
                setSubmitting(false)
             }
          )
        }
    })
)(Login)

