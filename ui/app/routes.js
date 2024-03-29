const DEFAULT_ROUTE = '/'
const UNLOCK_ROUTE = '/unlock'
const LOCK_ROUTE = '/lock'
const SETTINGS_ROUTE = '/settings'
const INFO_ROUTE = '/settings/info'
const REVEAL_SEED_ROUTE = '/seed'
const MOBILE_SYNC_ROUTE = '/mobile-sync'
const CONFIRM_SEED_ROUTE = '/confirm-seed'
const RESTORE_VAULT_ROUTE = '/restore-vault'
const ADD_TOKEN_ROUTE = '/add-token'
const CONFIRM_ADD_TOKEN_ROUTE = '/confirm-add-token'
const CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE = '/confirm-add-suggested-token'
const NEW_ACCOUNT_ROUTE = '/new-account'
const IMPORT_ACCOUNT_ROUTE = '/new-account/import'
const CONNECT_HARDWARE_ROUTE = '/new-account/connect'
const SEND_ROUTE = '/send'
const CREATE_ORDER_ROUTE = '/create-order'
const NOTICE_ROUTE = '/notice'
const WELCOME_ROUTE = '/welcome'

const INITIALIZE_ROUTE = '/initialize'
const INITIALIZE_WELCOME_ROUTE = '/initialize/welcome'
const INITIALIZE_UNLOCK_ROUTE = '/initialize/unlock'
const INITIALIZE_CREATE_PASSWORD_ROUTE = '/initialize/create-password'
const INITIALIZE_IMPORT_ACCOUNT_ROUTE = '/initialize/create-password/import-account'
const INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE = '/initialize/create-password/import-with-seed-phrase'
const INITIALIZE_IMPORT_WITH_SECRET = '/initialize/create-password/import-with-secret'
const INITIALIZE_IMPORT_WITH_KEYSTORE = '/initialize/create-password/import-with-keystore'
const INITIALIZE_CREATE_PASSWORD = '/initialize/create-password/create-password'
const INITIALIZE_UNIQUE_IMAGE_ROUTE = '/initialize/create-password/unique-image'
const INITIALIZE_NOTICE_ROUTE = '/initialize/notice'
const INITIALIZE_SELECT_ACTION_ROUTE = '/initialize/select-action'
const INITIALIZE_SEED_PHRASE_ROUTE = '/initialize/seed-phrase'
const INITIALIZE_END_OF_FLOW_ROUTE = '/initialize/end-of-flow'
const INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE = '/initialize/seed-phrase/confirm'
const INITIALIZE_METAMETRICS_OPT_IN_ROUTE = '/initialize/metametrics-opt-in'

const CONFIRM_TRANSACTION_ROUTE = '/confirm-transaction'
const CONFIRM_SEND_ETHER_PATH = '/send-ether'
const CONFIRM_SEND_TOKEN_PATH = '/send-token'
const CONFIRM_DEPLOY_CONTRACT_PATH = '/deploy-contract'
const CONFIRM_APPROVE_PATH = '/approve'
const CONFIRM_TRANSFER_FROM_PATH = '/transfer-from'
const CONFIRM_TOKEN_METHOD_PATH = '/token-method'
const SIGNATURE_REQUEST_PATH = '/signature-request'

const CREATE_WALLET = "/create-wallet"

//非 initialize 路径将会添加 首页的导航，这里省懶劲都搞成 initialize 路径了
const WALLET_MANAGE = "/initialize/wallet-manage"
const WALLET_MANAGE_SECRET_EXPORT = "/initialize/wallet-manage/secret-export"
const WALLET_MANAGE_CHANGE_PASSWORD = "/initialize/wallet-manage/password-change"
const WALLET_MANAGE_CHANGE_RESTORE = "/initialize/wallet-manage/password-restore"

const WALLET_ADD = "/initialize/wallet-add"
const WALLET_ADD_BY_CREATE = "/initialize/wallet-add/create"
const WALLET_ADD_BY_IMPORT = "/initialize/wallet-add/import"
const WALLET_ADD_SET_NAME = "/initialize/wallet-add/setName"
module.exports = {
  DEFAULT_ROUTE,
  WALLET_ADD,
  WALLET_ADD_BY_IMPORT,
  WALLET_ADD_BY_CREATE,
  WALLET_ADD_SET_NAME,
  UNLOCK_ROUTE,
  LOCK_ROUTE,
  SETTINGS_ROUTE,
  INFO_ROUTE,
  REVEAL_SEED_ROUTE,
  MOBILE_SYNC_ROUTE,
  CONFIRM_SEED_ROUTE,
  RESTORE_VAULT_ROUTE,
  ADD_TOKEN_ROUTE,
  INITIALIZE_CREATE_PASSWORD,
  CONFIRM_ADD_TOKEN_ROUTE,
  CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE,
  NEW_ACCOUNT_ROUTE,
  IMPORT_ACCOUNT_ROUTE,
  CREATE_WALLET,
  WALLET_MANAGE,
  WALLET_MANAGE_SECRET_EXPORT,
  WALLET_MANAGE_CHANGE_PASSWORD,
  CONNECT_HARDWARE_ROUTE,
  WALLET_MANAGE_CHANGE_RESTORE,
  SEND_ROUTE,
  CREATE_ORDER_ROUTE,
  NOTICE_ROUTE,
  WELCOME_ROUTE,
  INITIALIZE_ROUTE,
  INITIALIZE_WELCOME_ROUTE,
  INITIALIZE_UNLOCK_ROUTE,
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_IMPORT_ACCOUNT_ROUTE,
  INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE,
  INITIALIZE_IMPORT_WITH_KEYSTORE,
  INITIALIZE_IMPORT_WITH_SECRET,
  INITIALIZE_UNIQUE_IMAGE_ROUTE,
  INITIALIZE_NOTICE_ROUTE,
  INITIALIZE_SELECT_ACTION_ROUTE,
  INITIALIZE_SEED_PHRASE_ROUTE,
  INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE,
  INITIALIZE_END_OF_FLOW_ROUTE,
  CONFIRM_TRANSACTION_ROUTE,
  CONFIRM_SEND_ETHER_PATH,
  CONFIRM_SEND_TOKEN_PATH,
  CONFIRM_DEPLOY_CONTRACT_PATH,
  CONFIRM_APPROVE_PATH,
  CONFIRM_TRANSFER_FROM_PATH,
  CONFIRM_TOKEN_METHOD_PATH,
  SIGNATURE_REQUEST_PATH,
  INITIALIZE_METAMETRICS_OPT_IN_ROUTE,
}
