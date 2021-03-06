import gql from 'graphql-tag'

const agentQuery = gql`
query ($token: String, $id: Int) {
    viewer(token: $token) {
      agent(id: $id) {
        id
        name
        image
        note
        type
        agentRelationships {
          object {
            id
            name
            image
          }
          subject {
            name
            image
            id
          }
        }
        ownedEconomicResources {
          resourceClassifiedAs {
            name
            category
          }
          currentQuantity {
            numericValue
            unit {
              name
            }
          }
        }
        agentEconomicEvents(latestNumberOfDays: 30) {
          note
          action
          provider {
            image
            name
          }
          inputOf {
            name
          }
          receiver {
            name
          }
          start
          requestDistribution
          note
          affectedQuantity {
            numericValue
            unit {
              name
            }
          }
        }
        agentPlans (isFinished: false) {
          name
          id
          note
          due
          plannedOn
          planProcesses {
            isStarted
            isFinished
            name
            workingAgents {
              id
              name
              image
            }
          }
        }
      }
    }
  }
`

export default agentQuery
