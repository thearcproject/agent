import * as React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import style from "./style.css";
import { Route, withRouter } from "react-router-dom";
import Sidebar from "../../components/sidebar";
import { compose, withHandlers, withState } from "recompose";
import Canvas from "../../canvas/wrapper";
import Settings from "../../settings/wrapper";
import Agent from "../../agent/wrapper";
import Overview from "../../overview/wrapper";
import { PropsRoute } from "../../helpers/router";
import Validate from '../../validation_plan/wrapper'
import updateNotification from "../../mutations/updateNotification";
import deleteNotification from "../../mutations/deleteNotification";
import {LoadingMini} from '../../components/loading'

const AppTemplate = props => {
  return props.loading ? (
    <LoadingMini />
  ) : props.error ? (
    <p style={{ color: "#F00" }}>API error</p>
  ) : (
    <div className={style.surface}>
      <div className={style.content}>
        <div className={style.boards}>
          <div className={style.boards_main_content}>
            <div className={style.boards_canvas}>
              <div className={style.canvas}>
                <Sidebar
                  handleTogglePanel={props.handleTogglePanel}
                  panel={props.panel}
                  data={props.data}
                  agents={props.data.agentRelationships}
                  history={props.history}
                />
                <div
                  className={
                    props.panel
                      ? style.container + " " + style.full
                      : style.container
                  }
                >
                  <PropsRoute
                    exact
                    path={props.match.path}
                    component={Overview}
                    id={props.data.id}
                  />
                  <PropsRoute
                    path="/agent/:id"
                    component={Agent}
                    data={props}
                  />
                  <PropsRoute
                    exact
                    path="/canvas/:id"
                    component={Canvas}
                    relationships={props.data.agentRelationships}
                  />
                  <PropsRoute
                    path="/canvas/:id/validate"
                    component={Validate}
                    relationships={props.data.agentRelationships}
                  />
                  <Route path="/settings" component={Settings} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const agentPlans = gql`
  query($token: String) {
    viewer(token: $token) {
      myAgent {
        id
        name
        image
        agentPlans {
          id
        }
        agentRelationships {
          relationship {
            label
            category
          }
          object {
            id
            name
            note
            image
          }
        }
      }
    }
  }
`;
const App = withRouter(AppTemplate);

export default compose(
  graphql(updateNotification, {name: 'updateNotification'}),
  graphql(deleteNotification, {name: 'deleteNotification'}),
  graphql(agentPlans, {
    options: props => ({
      variables: {
        token: localStorage.getItem("oce_token")
      }
    }),
    props: ({ ownProps, data: { viewer, loading, error, refetch } }) => ({
      loading,
      error,
      refetch,
      data: viewer ? viewer.myAgent : null
    })
  }),
  withState("panel", "togglePanel", true),
  withHandlers({
    handleTogglePanel: props => event => {
      props.togglePanel(!props.panel);
    }
  })
)(App);
