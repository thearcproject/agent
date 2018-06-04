import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const createCommitment = gql`
mutation ($token: String!, $inputOfId: Int, $committedUnitId:Int!, $due:String!, $action: String!, $planId: Int, $note: String, $committedNumericValue: String!, $committedResourceClassifiedAsId: Int!, $providerId: Int, $scopeId: Int) {
  createCommitment(token: $token, inputOfId: $inputOfId, committedUnitId:$committedUnitId, due:$due, action: $action, note: $note, committedResourceClassifiedAsId: $committedResourceClassifiedAsId, planId: $planId, scopeId: $scopeId, committedNumericValue: $committedNumericValue, providerId: $providerId) {
    commitment {
        action
        id
        note
        fulfilledBy {
          fulfilledQuantity {
            numericValue
          }
          fulfills {
            action
            fulfilledBy{
              fulfilledBy {
                requestDistribution
              }
            }
          }
        }
        inputOf {
          id
          name
        }
        due
        isFinished
        involvedAgents {
          image
          id
          name
        }
        committedQuantity {
          unit {
            name
          }
          numericValue
        }
        resourceClassifiedAs {
          category
          name
        }
      }
  }
}
`

export default createCommitment
