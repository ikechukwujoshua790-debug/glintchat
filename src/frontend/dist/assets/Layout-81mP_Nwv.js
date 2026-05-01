var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a, _client2, _currentResult2, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn2, _b;
import { i as ProtocolError, T as TimeoutWaitingForResponseErrorCode, k as utf8ToBytes, E as ExternalError, M as MissingRootKeyErrorCode, C as Certificate, l as lookupResultToBuffer, m as RequestStatusResponseStatus, U as UnknownError, n as RequestStatusDoneNoReplyErrorCode, o as RejectError, p as CertifiedRejectErrorCode, q as UNREACHABLE_ERROR, I as InputError, t as InvalidReadStateRequestErrorCode, v as ReadRequestType, P as Principal, w as IDL, x as MissingCanisterIdErrorCode, H as HttpAgent, y as encode, Q as QueryResponseStatus, z as UncertifiedRejectErrorCode, A as isV3ResponseBody, B as isV2ResponseBody, D as UncertifiedRejectUpdateErrorCode, F as UnexpectedErrorCode, G as decode, S as Subscribable, J as pendingThenable, K as resolveEnabled, N as shallowEqualObjects, O as resolveStaleTime, V as noop, W as environmentManager, X as isValidTimeout, Y as timeUntilStale, Z as timeoutManager, _ as focusManager, $ as fetchState, a0 as replaceData, a1 as notifyManager, a2 as hashKey, a3 as getDefaultState, r as reactExports, a4 as shouldThrowError, h as useQueryClient, g as useInternetIdentity, a5 as createActorWithConfig, a6 as useRouterState, a7 as Record, a8 as Opt, a9 as Variant, aa as Vec, ab as Service, ac as Func, ad as Text, ae as Nat, af as Principal$1, ag as Nat8, ah as Null, ai as Bool, aj as Int, j as jsxRuntimeExports, ak as Link, a as LogoWithText } from "./index-DFLYPydE.js";
import { c as createLucideIcon, S as ShieldCheck } from "./button-CQxG3T_J.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var MutationObserver = (_b = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _currentResult2);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client2, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client2).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client2).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult2);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client2).getMutationCache().build(__privateGet(this, _client2), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client2 = new WeakMap(), _currentResult2 = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult2, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn2 = function(action) {
  notifyManager.batch(() => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult2).variables;
      const onMutateResult = __privateGet(this, _currentResult2).context;
      const context = {
        client: __privateGet(this, _client2),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b2 = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b2.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult2));
    });
  });
}, _b);
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b2, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b2 = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b2.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
function useLocation(opts) {
  return useRouterState({
    select: (state) => state.location
  });
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
  ["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }]
];
const Ellipsis = createLucideIcon("ellipsis", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["line", { x1: "4", x2: "20", y1: "9", y2: "9", key: "4lhtct" }],
  ["line", { x1: "4", x2: "20", y1: "15", y2: "15", key: "vyu0kd" }],
  ["line", { x1: "10", x2: "8", y1: "3", y2: "21", key: "1ggp8o" }],
  ["line", { x1: "16", x2: "14", y1: "3", y2: "21", key: "weycgp" }]
];
const Hash = createLucideIcon("hash", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }]
];
const MessageCircle = createLucideIcon("message-circle", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M4.9 19.1C1 15.2 1 8.8 4.9 4.9", key: "1vaf9d" }],
  ["path", { d: "M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5", key: "u1ii0m" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5", key: "1j5fej" }],
  ["path", { d: "M19.1 4.9C23 8.8 23 15.1 19.1 19", key: "10b0cb" }]
];
const Radio = createLucideIcon("radio", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
const _ImmutableObjectStorageCreateCertificateResult = Record({
  "method": Text,
  "blob_hash": Text
});
const _ImmutableObjectStorageRefillInformation = Record({
  "proposed_top_up_amount": Opt(Nat)
});
const _ImmutableObjectStorageRefillResult = Record({
  "success": Opt(Bool),
  "topped_up_amount": Opt(Nat)
});
const GroupId = Nat;
const UserId = Principal$1;
const PaymentId = Nat;
const PayoutStatus$1 = Variant({
  "pending": Null,
  "processed": Null
});
const Timestamp = Int;
const PayoutRequest = Record({
  "id": PaymentId,
  "status": PayoutStatus$1,
  "totalAmount": Nat,
  "requestedAt": Timestamp
});
const UserProfile = Record({
  "id": UserId,
  "realName": Text,
  "createdAt": Timestamp,
  "isVerified": Bool,
  "phone": Text
});
const VerificationStatus$1 = Variant({
  "pending": Null,
  "approved": Null,
  "rejected": Null
});
const VerificationRequest = Record({
  "status": VerificationStatus$1,
  "userId": UserId,
  "submittedAt": Timestamp,
  "receiptStorageKey": Text,
  "verifiedAt": Opt(Timestamp)
});
const UserRole = Variant({
  "admin": Null,
  "user": Null,
  "guest": Null
});
const CallType$1 = Variant({ "video": Null, "voice": Null });
const CallRoom = Record({
  "participants": Vec(UserId),
  "roomUrl": Text,
  "createdAt": Timestamp,
  "callType": CallType$1,
  "roomId": Text
});
const ChannelId = Nat;
const Channel = Record({
  "id": ChannelId,
  "name": Text,
  "createdAt": Timestamp,
  "description": Text
});
const GroupMember = Record({
  "userId": UserId,
  "joinedAt": Timestamp,
  "isAdmin": Bool
});
const Group = Record({
  "id": GroupId,
  "members": Vec(GroupMember),
  "name": Text,
  "createdAt": Timestamp,
  "creatorId": UserId
});
const StatusId = Nat;
const StatusPost = Record({
  "id": StatusId,
  "content": Text,
  "expiresAt": Timestamp,
  "authorId": UserId,
  "createdAt": Timestamp
});
const ChannelPost = Record({
  "id": Nat,
  "postedAt": Timestamp,
  "content": Text,
  "channelId": ChannelId,
  "authorId": UserId
});
const MessageId = Nat;
const MediaType$1 = Variant({
  "audio": Null,
  "video": Null,
  "none": Null,
  "image": Null
});
const Message = Record({
  "id": MessageId,
  "content": Text,
  "mediaUrl": Opt(Text),
  "timestamp": Timestamp,
  "mediaType": MediaType$1,
  "senderId": UserId
});
const StripeSessionStatus = Variant({
  "completed": Record({
    "userPrincipal": Opt(Text),
    "response": Text
  }),
  "failed": Record({ "error": Text })
});
const MediaUploadCertificate = Record({
  "method": Text,
  "blobHash": Text
});
const StripeConfiguration = Record({
  "allowedCountries": Vec(Text),
  "secretKey": Text
});
const http_header = Record({
  "value": Text,
  "name": Text
});
const http_request_result = Record({
  "status": Nat,
  "body": Vec(Nat8),
  "headers": Vec(http_header)
});
const TransformationInput = Record({
  "context": Vec(Nat8),
  "response": http_request_result
});
const TransformationOutput = Record({
  "status": Nat,
  "body": Vec(Nat8),
  "headers": Vec(http_header)
});
Service({
  "_immutableObjectStorageBlobsAreLive": Func(
    [Vec(Vec(Nat8))],
    [Vec(Bool)],
    ["query"]
  ),
  "_immutableObjectStorageBlobsToDelete": Func(
    [],
    [Vec(Vec(Nat8))],
    ["query"]
  ),
  "_immutableObjectStorageConfirmBlobDeletion": Func(
    [Vec(Vec(Nat8))],
    [],
    []
  ),
  "_immutableObjectStorageCreateCertificate": Func(
    [Text],
    [_ImmutableObjectStorageCreateCertificateResult],
    []
  ),
  "_immutableObjectStorageRefillCashier": Func(
    [Opt(_ImmutableObjectStorageRefillInformation)],
    [_ImmutableObjectStorageRefillResult],
    []
  ),
  "_immutableObjectStorageUpdateGatewayPrincipals": Func([], [], []),
  "_initializeAccessControl": Func([], [], []),
  "addGroupMember": Func([GroupId, UserId], [], []),
  "adminApproveVerification": Func(
    [Principal$1],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "adminGetTotalRevenue": Func([], [Nat], ["query"]),
  "adminListPayoutRequests": Func([], [Vec(PayoutRequest)], ["query"]),
  "adminListUsers": Func([], [Vec(UserProfile)], ["query"]),
  "adminListVerificationRequests": Func(
    [],
    [Vec(VerificationRequest)],
    ["query"]
  ),
  "adminRejectVerification": Func(
    [Principal$1],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "adminRequestPayout": Func([], [PayoutRequest], []),
  "assignCallerUserRole": Func([Principal$1, UserRole], [], []),
  "createCallRoom": Func(
    [UserId, CallType$1],
    [Variant({ "ok": CallRoom, "err": Text })],
    []
  ),
  "createChannel": Func([Text, Text], [Channel], []),
  "createCheckoutSession": Func(
    [
      Vec(
        Record({
          "productName": Text,
          "currency": Text,
          "quantity": Nat,
          "priceInCents": Nat,
          "productDescription": Text
        })
      ),
      Text,
      Text
    ],
    [Text],
    []
  ),
  "createGroup": Func([Text], [Group], []),
  "createStatusPost": Func([Text], [StatusPost], []),
  "deleteStatusPost": Func([StatusId], [], []),
  "getActiveStatusPosts": Func([], [Vec(StatusPost)], ["query"]),
  "getCallRoom": Func([Text], [Opt(CallRoom)], ["query"]),
  "getCallerUserProfile": Func([], [Opt(UserProfile)], ["query"]),
  "getCallerUserRole": Func([], [UserRole], ["query"]),
  "getChannelPosts": Func([ChannelId], [Vec(ChannelPost)], ["query"]),
  "getDirectMessages": Func([UserId], [Vec(Message)], ["query"]),
  "getGroup": Func([GroupId], [Opt(Group)], ["query"]),
  "getGroupMessages": Func([GroupId], [Vec(Message)], ["query"]),
  "getMediaDownloadUrl": Func([Text], [Text], []),
  "getMyVerificationRequest": Func(
    [],
    [Opt(VerificationRequest)],
    ["query"]
  ),
  "getStripeSessionStatus": Func([Text], [StripeSessionStatus], []),
  "getUserByPhone": Func([Text], [Opt(UserProfile)], ["query"]),
  "getUserProfile": Func([UserId], [Opt(UserProfile)], ["query"]),
  "isCallerAdmin": Func([], [Bool], ["query"]),
  "isStripeConfigured": Func([], [Bool], ["query"]),
  "leaveGroup": Func([GroupId], [], []),
  "listChannels": Func([], [Vec(Channel)], ["query"]),
  "listMyGroups": Func([], [Vec(Group)], ["query"]),
  "postToChannel": Func([ChannelId, Text], [ChannelPost], []),
  "registerUser": Func([Text, Text], [], []),
  "requestMediaUploadUrl": Func([Text], [MediaUploadCertificate], []),
  "saveCallerUserProfile": Func([UserProfile], [], []),
  "sendDirectMessage": Func(
    [UserId, Text, Opt(Text), MediaType$1],
    [Message],
    []
  ),
  "sendGroupMessage": Func(
    [GroupId, Text, Opt(Text), MediaType$1],
    [Message],
    []
  ),
  "setDailyApiKey": Func([Text], [], []),
  "setStripeConfiguration": Func([StripeConfiguration], [], []),
  "submitVerificationRequest": Func(
    [Text],
    [Variant({ "ok": VerificationRequest, "err": Text })],
    []
  ),
  "transform": Func(
    [TransformationInput],
    [TransformationOutput],
    ["query"]
  )
});
const idlFactory = ({ IDL: IDL2 }) => {
  const _ImmutableObjectStorageCreateCertificateResult2 = IDL2.Record({
    "method": IDL2.Text,
    "blob_hash": IDL2.Text
  });
  const _ImmutableObjectStorageRefillInformation2 = IDL2.Record({
    "proposed_top_up_amount": IDL2.Opt(IDL2.Nat)
  });
  const _ImmutableObjectStorageRefillResult2 = IDL2.Record({
    "success": IDL2.Opt(IDL2.Bool),
    "topped_up_amount": IDL2.Opt(IDL2.Nat)
  });
  const GroupId2 = IDL2.Nat;
  const UserId2 = IDL2.Principal;
  const PaymentId2 = IDL2.Nat;
  const PayoutStatus2 = IDL2.Variant({
    "pending": IDL2.Null,
    "processed": IDL2.Null
  });
  const Timestamp2 = IDL2.Int;
  const PayoutRequest2 = IDL2.Record({
    "id": PaymentId2,
    "status": PayoutStatus2,
    "totalAmount": IDL2.Nat,
    "requestedAt": Timestamp2
  });
  const UserProfile2 = IDL2.Record({
    "id": UserId2,
    "realName": IDL2.Text,
    "createdAt": Timestamp2,
    "isVerified": IDL2.Bool,
    "phone": IDL2.Text
  });
  const VerificationStatus2 = IDL2.Variant({
    "pending": IDL2.Null,
    "approved": IDL2.Null,
    "rejected": IDL2.Null
  });
  const VerificationRequest2 = IDL2.Record({
    "status": VerificationStatus2,
    "userId": UserId2,
    "submittedAt": Timestamp2,
    "receiptStorageKey": IDL2.Text,
    "verifiedAt": IDL2.Opt(Timestamp2)
  });
  const UserRole2 = IDL2.Variant({
    "admin": IDL2.Null,
    "user": IDL2.Null,
    "guest": IDL2.Null
  });
  const CallType2 = IDL2.Variant({ "video": IDL2.Null, "voice": IDL2.Null });
  const CallRoom2 = IDL2.Record({
    "participants": IDL2.Vec(UserId2),
    "roomUrl": IDL2.Text,
    "createdAt": Timestamp2,
    "callType": CallType2,
    "roomId": IDL2.Text
  });
  const ChannelId2 = IDL2.Nat;
  const Channel2 = IDL2.Record({
    "id": ChannelId2,
    "name": IDL2.Text,
    "createdAt": Timestamp2,
    "description": IDL2.Text
  });
  const GroupMember2 = IDL2.Record({
    "userId": UserId2,
    "joinedAt": Timestamp2,
    "isAdmin": IDL2.Bool
  });
  const Group2 = IDL2.Record({
    "id": GroupId2,
    "members": IDL2.Vec(GroupMember2),
    "name": IDL2.Text,
    "createdAt": Timestamp2,
    "creatorId": UserId2
  });
  const StatusId2 = IDL2.Nat;
  const StatusPost2 = IDL2.Record({
    "id": StatusId2,
    "content": IDL2.Text,
    "expiresAt": Timestamp2,
    "authorId": UserId2,
    "createdAt": Timestamp2
  });
  const ChannelPost2 = IDL2.Record({
    "id": IDL2.Nat,
    "postedAt": Timestamp2,
    "content": IDL2.Text,
    "channelId": ChannelId2,
    "authorId": UserId2
  });
  const MessageId2 = IDL2.Nat;
  const MediaType2 = IDL2.Variant({
    "audio": IDL2.Null,
    "video": IDL2.Null,
    "none": IDL2.Null,
    "image": IDL2.Null
  });
  const Message2 = IDL2.Record({
    "id": MessageId2,
    "content": IDL2.Text,
    "mediaUrl": IDL2.Opt(IDL2.Text),
    "timestamp": Timestamp2,
    "mediaType": MediaType2,
    "senderId": UserId2
  });
  const StripeSessionStatus2 = IDL2.Variant({
    "completed": IDL2.Record({
      "userPrincipal": IDL2.Opt(IDL2.Text),
      "response": IDL2.Text
    }),
    "failed": IDL2.Record({ "error": IDL2.Text })
  });
  const MediaUploadCertificate2 = IDL2.Record({
    "method": IDL2.Text,
    "blobHash": IDL2.Text
  });
  const StripeConfiguration2 = IDL2.Record({
    "allowedCountries": IDL2.Vec(IDL2.Text),
    "secretKey": IDL2.Text
  });
  const http_header2 = IDL2.Record({ "value": IDL2.Text, "name": IDL2.Text });
  const http_request_result2 = IDL2.Record({
    "status": IDL2.Nat,
    "body": IDL2.Vec(IDL2.Nat8),
    "headers": IDL2.Vec(http_header2)
  });
  const TransformationInput2 = IDL2.Record({
    "context": IDL2.Vec(IDL2.Nat8),
    "response": http_request_result2
  });
  const TransformationOutput2 = IDL2.Record({
    "status": IDL2.Nat,
    "body": IDL2.Vec(IDL2.Nat8),
    "headers": IDL2.Vec(http_header2)
  });
  return IDL2.Service({
    "_immutableObjectStorageBlobsAreLive": IDL2.Func(
      [IDL2.Vec(IDL2.Vec(IDL2.Nat8))],
      [IDL2.Vec(IDL2.Bool)],
      ["query"]
    ),
    "_immutableObjectStorageBlobsToDelete": IDL2.Func(
      [],
      [IDL2.Vec(IDL2.Vec(IDL2.Nat8))],
      ["query"]
    ),
    "_immutableObjectStorageConfirmBlobDeletion": IDL2.Func(
      [IDL2.Vec(IDL2.Vec(IDL2.Nat8))],
      [],
      []
    ),
    "_immutableObjectStorageCreateCertificate": IDL2.Func(
      [IDL2.Text],
      [_ImmutableObjectStorageCreateCertificateResult2],
      []
    ),
    "_immutableObjectStorageRefillCashier": IDL2.Func(
      [IDL2.Opt(_ImmutableObjectStorageRefillInformation2)],
      [_ImmutableObjectStorageRefillResult2],
      []
    ),
    "_immutableObjectStorageUpdateGatewayPrincipals": IDL2.Func([], [], []),
    "_initializeAccessControl": IDL2.Func([], [], []),
    "addGroupMember": IDL2.Func([GroupId2, UserId2], [], []),
    "adminApproveVerification": IDL2.Func(
      [IDL2.Principal],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "adminGetTotalRevenue": IDL2.Func([], [IDL2.Nat], ["query"]),
    "adminListPayoutRequests": IDL2.Func(
      [],
      [IDL2.Vec(PayoutRequest2)],
      ["query"]
    ),
    "adminListUsers": IDL2.Func([], [IDL2.Vec(UserProfile2)], ["query"]),
    "adminListVerificationRequests": IDL2.Func(
      [],
      [IDL2.Vec(VerificationRequest2)],
      ["query"]
    ),
    "adminRejectVerification": IDL2.Func(
      [IDL2.Principal],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "adminRequestPayout": IDL2.Func([], [PayoutRequest2], []),
    "assignCallerUserRole": IDL2.Func([IDL2.Principal, UserRole2], [], []),
    "createCallRoom": IDL2.Func(
      [UserId2, CallType2],
      [IDL2.Variant({ "ok": CallRoom2, "err": IDL2.Text })],
      []
    ),
    "createChannel": IDL2.Func([IDL2.Text, IDL2.Text], [Channel2], []),
    "createCheckoutSession": IDL2.Func(
      [
        IDL2.Vec(
          IDL2.Record({
            "productName": IDL2.Text,
            "currency": IDL2.Text,
            "quantity": IDL2.Nat,
            "priceInCents": IDL2.Nat,
            "productDescription": IDL2.Text
          })
        ),
        IDL2.Text,
        IDL2.Text
      ],
      [IDL2.Text],
      []
    ),
    "createGroup": IDL2.Func([IDL2.Text], [Group2], []),
    "createStatusPost": IDL2.Func([IDL2.Text], [StatusPost2], []),
    "deleteStatusPost": IDL2.Func([StatusId2], [], []),
    "getActiveStatusPosts": IDL2.Func([], [IDL2.Vec(StatusPost2)], ["query"]),
    "getCallRoom": IDL2.Func([IDL2.Text], [IDL2.Opt(CallRoom2)], ["query"]),
    "getCallerUserProfile": IDL2.Func([], [IDL2.Opt(UserProfile2)], ["query"]),
    "getCallerUserRole": IDL2.Func([], [UserRole2], ["query"]),
    "getChannelPosts": IDL2.Func(
      [ChannelId2],
      [IDL2.Vec(ChannelPost2)],
      ["query"]
    ),
    "getDirectMessages": IDL2.Func([UserId2], [IDL2.Vec(Message2)], ["query"]),
    "getGroup": IDL2.Func([GroupId2], [IDL2.Opt(Group2)], ["query"]),
    "getGroupMessages": IDL2.Func([GroupId2], [IDL2.Vec(Message2)], ["query"]),
    "getMediaDownloadUrl": IDL2.Func([IDL2.Text], [IDL2.Text], []),
    "getMyVerificationRequest": IDL2.Func(
      [],
      [IDL2.Opt(VerificationRequest2)],
      ["query"]
    ),
    "getStripeSessionStatus": IDL2.Func([IDL2.Text], [StripeSessionStatus2], []),
    "getUserByPhone": IDL2.Func([IDL2.Text], [IDL2.Opt(UserProfile2)], ["query"]),
    "getUserProfile": IDL2.Func([UserId2], [IDL2.Opt(UserProfile2)], ["query"]),
    "isCallerAdmin": IDL2.Func([], [IDL2.Bool], ["query"]),
    "isStripeConfigured": IDL2.Func([], [IDL2.Bool], ["query"]),
    "leaveGroup": IDL2.Func([GroupId2], [], []),
    "listChannels": IDL2.Func([], [IDL2.Vec(Channel2)], ["query"]),
    "listMyGroups": IDL2.Func([], [IDL2.Vec(Group2)], ["query"]),
    "postToChannel": IDL2.Func([ChannelId2, IDL2.Text], [ChannelPost2], []),
    "registerUser": IDL2.Func([IDL2.Text, IDL2.Text], [], []),
    "requestMediaUploadUrl": IDL2.Func(
      [IDL2.Text],
      [MediaUploadCertificate2],
      []
    ),
    "saveCallerUserProfile": IDL2.Func([UserProfile2], [], []),
    "sendDirectMessage": IDL2.Func(
      [UserId2, IDL2.Text, IDL2.Opt(IDL2.Text), MediaType2],
      [Message2],
      []
    ),
    "sendGroupMessage": IDL2.Func(
      [GroupId2, IDL2.Text, IDL2.Opt(IDL2.Text), MediaType2],
      [Message2],
      []
    ),
    "setDailyApiKey": IDL2.Func([IDL2.Text], [], []),
    "setStripeConfiguration": IDL2.Func([StripeConfiguration2], [], []),
    "submitVerificationRequest": IDL2.Func(
      [IDL2.Text],
      [IDL2.Variant({ "ok": VerificationRequest2, "err": IDL2.Text })],
      []
    ),
    "transform": IDL2.Func(
      [TransformationInput2],
      [TransformationOutput2],
      ["query"]
    )
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
var CallType = /* @__PURE__ */ ((CallType2) => {
  CallType2["video"] = "video";
  CallType2["voice"] = "voice";
  return CallType2;
})(CallType || {});
var MediaType = /* @__PURE__ */ ((MediaType2) => {
  MediaType2["audio"] = "audio";
  MediaType2["video"] = "video";
  MediaType2["none"] = "none";
  MediaType2["image"] = "image";
  return MediaType2;
})(MediaType || {});
var PayoutStatus = /* @__PURE__ */ ((PayoutStatus2) => {
  PayoutStatus2["pending"] = "pending";
  PayoutStatus2["processed"] = "processed";
  return PayoutStatus2;
})(PayoutStatus || {});
var VerificationStatus = /* @__PURE__ */ ((VerificationStatus2) => {
  VerificationStatus2["pending"] = "pending";
  VerificationStatus2["approved"] = "approved";
  VerificationStatus2["rejected"] = "rejected";
  return VerificationStatus2;
})(VerificationStatus || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async _immutableObjectStorageBlobsAreLive(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageBlobsAreLive(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageBlobsAreLive(arg0);
      return result;
    }
  }
  async _immutableObjectStorageBlobsToDelete() {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageBlobsToDelete();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageBlobsToDelete();
      return result;
    }
  }
  async _immutableObjectStorageConfirmBlobDeletion(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageConfirmBlobDeletion(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageConfirmBlobDeletion(arg0);
      return result;
    }
  }
  async _immutableObjectStorageCreateCertificate(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageCreateCertificate(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageCreateCertificate(arg0);
      return result;
    }
  }
  async _immutableObjectStorageRefillCashier(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageRefillCashier(to_candid_opt_n1(this._uploadFile, this._downloadFile, arg0));
        return from_candid__ImmutableObjectStorageRefillResult_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageRefillCashier(to_candid_opt_n1(this._uploadFile, this._downloadFile, arg0));
      return from_candid__ImmutableObjectStorageRefillResult_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async _immutableObjectStorageUpdateGatewayPrincipals() {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageUpdateGatewayPrincipals();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageUpdateGatewayPrincipals();
      return result;
    }
  }
  async _initializeAccessControl() {
    if (this.processError) {
      try {
        const result = await this.actor._initializeAccessControl();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._initializeAccessControl();
      return result;
    }
  }
  async addGroupMember(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.addGroupMember(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addGroupMember(arg0, arg1);
      return result;
    }
  }
  async adminApproveVerification(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminApproveVerification(arg0);
        return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminApproveVerification(arg0);
      return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminGetTotalRevenue() {
    if (this.processError) {
      try {
        const result = await this.actor.adminGetTotalRevenue();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminGetTotalRevenue();
      return result;
    }
  }
  async adminListPayoutRequests() {
    if (this.processError) {
      try {
        const result = await this.actor.adminListPayoutRequests();
        return from_candid_vec_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminListPayoutRequests();
      return from_candid_vec_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminListUsers() {
    if (this.processError) {
      try {
        const result = await this.actor.adminListUsers();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminListUsers();
      return result;
    }
  }
  async adminListVerificationRequests() {
    if (this.processError) {
      try {
        const result = await this.actor.adminListVerificationRequests();
        return from_candid_vec_n14(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminListVerificationRequests();
      return from_candid_vec_n14(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminRejectVerification(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adminRejectVerification(arg0);
        return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminRejectVerification(arg0);
      return from_candid_variant_n8(this._uploadFile, this._downloadFile, result);
    }
  }
  async adminRequestPayout() {
    if (this.processError) {
      try {
        const result = await this.actor.adminRequestPayout();
        return from_candid_PayoutRequest_n10(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adminRequestPayout();
      return from_candid_PayoutRequest_n10(this._uploadFile, this._downloadFile, result);
    }
  }
  async assignCallerUserRole(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n20(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n20(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async createCallRoom(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.createCallRoom(arg0, to_candid_CallType_n22(this._uploadFile, this._downloadFile, arg1));
        return from_candid_variant_n24(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createCallRoom(arg0, to_candid_CallType_n22(this._uploadFile, this._downloadFile, arg1));
      return from_candid_variant_n24(this._uploadFile, this._downloadFile, result);
    }
  }
  async createChannel(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.createChannel(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createChannel(arg0, arg1);
      return result;
    }
  }
  async createCheckoutSession(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.createCheckoutSession(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createCheckoutSession(arg0, arg1, arg2);
      return result;
    }
  }
  async createGroup(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createGroup(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createGroup(arg0);
      return result;
    }
  }
  async createStatusPost(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createStatusPost(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createStatusPost(arg0);
      return result;
    }
  }
  async deleteStatusPost(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteStatusPost(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteStatusPost(arg0);
      return result;
    }
  }
  async getActiveStatusPosts() {
    if (this.processError) {
      try {
        const result = await this.actor.getActiveStatusPosts();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getActiveStatusPosts();
      return result;
    }
  }
  async getCallRoom(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getCallRoom(arg0);
        return from_candid_opt_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCallRoom(arg0);
      return from_candid_opt_n29(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCallerUserProfile() {
    if (this.processError) {
      try {
        const result = await this.actor.getCallerUserProfile();
        return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCallerUserProfile();
      return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCallerUserRole() {
    if (this.processError) {
      try {
        const result = await this.actor.getCallerUserRole();
        return from_candid_UserRole_n31(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCallerUserRole();
      return from_candid_UserRole_n31(this._uploadFile, this._downloadFile, result);
    }
  }
  async getChannelPosts(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getChannelPosts(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getChannelPosts(arg0);
      return result;
    }
  }
  async getDirectMessages(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getDirectMessages(arg0);
        return from_candid_vec_n33(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getDirectMessages(arg0);
      return from_candid_vec_n33(this._uploadFile, this._downloadFile, result);
    }
  }
  async getGroup(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getGroup(arg0);
        return from_candid_opt_n39(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getGroup(arg0);
      return from_candid_opt_n39(this._uploadFile, this._downloadFile, result);
    }
  }
  async getGroupMessages(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getGroupMessages(arg0);
        return from_candid_vec_n33(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getGroupMessages(arg0);
      return from_candid_vec_n33(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMediaDownloadUrl(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getMediaDownloadUrl(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMediaDownloadUrl(arg0);
      return result;
    }
  }
  async getMyVerificationRequest() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyVerificationRequest();
        return from_candid_opt_n40(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyVerificationRequest();
      return from_candid_opt_n40(this._uploadFile, this._downloadFile, result);
    }
  }
  async getStripeSessionStatus(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getStripeSessionStatus(arg0);
        return from_candid_StripeSessionStatus_n41(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getStripeSessionStatus(arg0);
      return from_candid_StripeSessionStatus_n41(this._uploadFile, this._downloadFile, result);
    }
  }
  async getUserByPhone(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getUserByPhone(arg0);
        return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getUserByPhone(arg0);
      return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
    }
  }
  async getUserProfile(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getUserProfile(arg0);
        return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getUserProfile(arg0);
      return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
    }
  }
  async isCallerAdmin() {
    if (this.processError) {
      try {
        const result = await this.actor.isCallerAdmin();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isCallerAdmin();
      return result;
    }
  }
  async isStripeConfigured() {
    if (this.processError) {
      try {
        const result = await this.actor.isStripeConfigured();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isStripeConfigured();
      return result;
    }
  }
  async leaveGroup(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.leaveGroup(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.leaveGroup(arg0);
      return result;
    }
  }
  async listChannels() {
    if (this.processError) {
      try {
        const result = await this.actor.listChannels();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listChannels();
      return result;
    }
  }
  async listMyGroups() {
    if (this.processError) {
      try {
        const result = await this.actor.listMyGroups();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listMyGroups();
      return result;
    }
  }
  async postToChannel(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.postToChannel(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.postToChannel(arg0, arg1);
      return result;
    }
  }
  async registerUser(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.registerUser(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.registerUser(arg0, arg1);
      return result;
    }
  }
  async requestMediaUploadUrl(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.requestMediaUploadUrl(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.requestMediaUploadUrl(arg0);
      return result;
    }
  }
  async saveCallerUserProfile(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.saveCallerUserProfile(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.saveCallerUserProfile(arg0);
      return result;
    }
  }
  async sendDirectMessage(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.sendDirectMessage(arg0, arg1, to_candid_opt_n44(this._uploadFile, this._downloadFile, arg2), to_candid_MediaType_n45(this._uploadFile, this._downloadFile, arg3));
        return from_candid_Message_n34(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.sendDirectMessage(arg0, arg1, to_candid_opt_n44(this._uploadFile, this._downloadFile, arg2), to_candid_MediaType_n45(this._uploadFile, this._downloadFile, arg3));
      return from_candid_Message_n34(this._uploadFile, this._downloadFile, result);
    }
  }
  async sendGroupMessage(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.sendGroupMessage(arg0, arg1, to_candid_opt_n44(this._uploadFile, this._downloadFile, arg2), to_candid_MediaType_n45(this._uploadFile, this._downloadFile, arg3));
        return from_candid_Message_n34(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.sendGroupMessage(arg0, arg1, to_candid_opt_n44(this._uploadFile, this._downloadFile, arg2), to_candid_MediaType_n45(this._uploadFile, this._downloadFile, arg3));
      return from_candid_Message_n34(this._uploadFile, this._downloadFile, result);
    }
  }
  async setDailyApiKey(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.setDailyApiKey(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setDailyApiKey(arg0);
      return result;
    }
  }
  async setStripeConfiguration(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.setStripeConfiguration(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setStripeConfiguration(arg0);
      return result;
    }
  }
  async submitVerificationRequest(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.submitVerificationRequest(arg0);
        return from_candid_variant_n47(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.submitVerificationRequest(arg0);
      return from_candid_variant_n47(this._uploadFile, this._downloadFile, result);
    }
  }
  async transform(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.transform(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.transform(arg0);
      return result;
    }
  }
}
function from_candid_CallRoom_n25(_uploadFile, _downloadFile, value) {
  return from_candid_record_n26(_uploadFile, _downloadFile, value);
}
function from_candid_CallType_n27(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n28(_uploadFile, _downloadFile, value);
}
function from_candid_MediaType_n37(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n38(_uploadFile, _downloadFile, value);
}
function from_candid_Message_n34(_uploadFile, _downloadFile, value) {
  return from_candid_record_n35(_uploadFile, _downloadFile, value);
}
function from_candid_PayoutRequest_n10(_uploadFile, _downloadFile, value) {
  return from_candid_record_n11(_uploadFile, _downloadFile, value);
}
function from_candid_PayoutStatus_n12(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n13(_uploadFile, _downloadFile, value);
}
function from_candid_StripeSessionStatus_n41(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n42(_uploadFile, _downloadFile, value);
}
function from_candid_UserRole_n31(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n32(_uploadFile, _downloadFile, value);
}
function from_candid_VerificationRequest_n15(_uploadFile, _downloadFile, value) {
  return from_candid_record_n16(_uploadFile, _downloadFile, value);
}
function from_candid_VerificationStatus_n17(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n18(_uploadFile, _downloadFile, value);
}
function from_candid__ImmutableObjectStorageRefillResult_n4(_uploadFile, _downloadFile, value) {
  return from_candid_record_n5(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n19(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n29(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_CallRoom_n25(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n30(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n36(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n39(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n40(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_VerificationRequest_n15(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n6(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n7(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n11(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_PayoutStatus_n12(_uploadFile, _downloadFile, value.status),
    totalAmount: value.totalAmount,
    requestedAt: value.requestedAt
  };
}
function from_candid_record_n16(_uploadFile, _downloadFile, value) {
  return {
    status: from_candid_VerificationStatus_n17(_uploadFile, _downloadFile, value.status),
    userId: value.userId,
    submittedAt: value.submittedAt,
    receiptStorageKey: value.receiptStorageKey,
    verifiedAt: record_opt_to_undefined(from_candid_opt_n19(_uploadFile, _downloadFile, value.verifiedAt))
  };
}
function from_candid_record_n26(_uploadFile, _downloadFile, value) {
  return {
    participants: value.participants,
    roomUrl: value.roomUrl,
    createdAt: value.createdAt,
    callType: from_candid_CallType_n27(_uploadFile, _downloadFile, value.callType),
    roomId: value.roomId
  };
}
function from_candid_record_n35(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    content: value.content,
    mediaUrl: record_opt_to_undefined(from_candid_opt_n36(_uploadFile, _downloadFile, value.mediaUrl)),
    timestamp: value.timestamp,
    mediaType: from_candid_MediaType_n37(_uploadFile, _downloadFile, value.mediaType),
    senderId: value.senderId
  };
}
function from_candid_record_n43(_uploadFile, _downloadFile, value) {
  return {
    userPrincipal: record_opt_to_undefined(from_candid_opt_n36(_uploadFile, _downloadFile, value.userPrincipal)),
    response: value.response
  };
}
function from_candid_record_n5(_uploadFile, _downloadFile, value) {
  return {
    success: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.success)),
    topped_up_amount: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.topped_up_amount))
  };
}
function from_candid_variant_n13(_uploadFile, _downloadFile, value) {
  return "pending" in value ? "pending" : "processed" in value ? "processed" : value;
}
function from_candid_variant_n18(_uploadFile, _downloadFile, value) {
  return "pending" in value ? "pending" : "approved" in value ? "approved" : "rejected" in value ? "rejected" : value;
}
function from_candid_variant_n24(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_CallRoom_n25(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n28(_uploadFile, _downloadFile, value) {
  return "video" in value ? "video" : "voice" in value ? "voice" : value;
}
function from_candid_variant_n32(_uploadFile, _downloadFile, value) {
  return "admin" in value ? "admin" : "user" in value ? "user" : "guest" in value ? "guest" : value;
}
function from_candid_variant_n38(_uploadFile, _downloadFile, value) {
  return "audio" in value ? "audio" : "video" in value ? "video" : "none" in value ? "none" : "image" in value ? "image" : value;
}
function from_candid_variant_n42(_uploadFile, _downloadFile, value) {
  return "completed" in value ? {
    __kind__: "completed",
    completed: from_candid_record_n43(_uploadFile, _downloadFile, value.completed)
  } : "failed" in value ? {
    __kind__: "failed",
    failed: value.failed
  } : value;
}
function from_candid_variant_n47(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_VerificationRequest_n15(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n8(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_vec_n14(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_VerificationRequest_n15(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n33(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Message_n34(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n9(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_PayoutRequest_n10(_uploadFile, _downloadFile, x));
}
function to_candid_CallType_n22(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n23(_uploadFile, _downloadFile, value);
}
function to_candid_MediaType_n45(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n46(_uploadFile, _downloadFile, value);
}
function to_candid_UserRole_n20(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n21(_uploadFile, _downloadFile, value);
}
function to_candid__ImmutableObjectStorageRefillInformation_n2(_uploadFile, _downloadFile, value) {
  return to_candid_record_n3(_uploadFile, _downloadFile, value);
}
function to_candid_opt_n1(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(to_candid__ImmutableObjectStorageRefillInformation_n2(_uploadFile, _downloadFile, value));
}
function to_candid_opt_n44(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_record_n3(_uploadFile, _downloadFile, value) {
  return {
    proposed_top_up_amount: value.proposed_top_up_amount ? candid_some(value.proposed_top_up_amount) : candid_none()
  };
}
function to_candid_variant_n21(_uploadFile, _downloadFile, value) {
  return value == "admin" ? {
    admin: null
  } : value == "user" ? {
    user: null
  } : value == "guest" ? {
    guest: null
  } : value;
}
function to_candid_variant_n23(_uploadFile, _downloadFile, value) {
  return value == "video" ? {
    video: null
  } : value == "voice" ? {
    voice: null
  } : value;
}
function to_candid_variant_n46(_uploadFile, _downloadFile, value) {
  return value == "audio" ? {
    audio: null
  } : value == "video" ? {
    video: null
  } : value == "none" ? {
    none: null
  } : value == "image" ? {
    image: null
  } : value;
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
function useBackendActor() {
  return useActor(createActor);
}
function useCallerProfile() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  const query = useQuery({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched
  };
}
function useUserProfile(userId) {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["userProfile", userId == null ? void 0 : userId.toString()],
    queryFn: async () => {
      if (!actor || !userId) return null;
      return actor.getUserProfile(userId);
    },
    enabled: !!actor && !actorFetching && !!userId
  });
}
function useRegisterUser() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      realName,
      phone
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.registerUser(realName, phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
    }
  });
}
function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching
  });
}
function useGetUserByPhone() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (phone) => {
      if (!actor) throw new Error("Actor not available");
      return actor.getUserByPhone(phone);
    }
  });
}
function useDirectMessages(otherUserId) {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["directMessages", otherUserId == null ? void 0 : otherUserId.toString()],
    queryFn: async () => {
      if (!actor || !otherUserId) return [];
      return actor.getDirectMessages(otherUserId);
    },
    enabled: !!actor && !actorFetching && !!otherUserId,
    refetchInterval: 3e3
  });
}
function useSendDirectMessage() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      recipientId,
      content,
      mediaUrl,
      mediaType
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.sendDirectMessage(
        recipientId,
        content,
        mediaUrl ?? null,
        mediaType ?? MediaType.none
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["directMessages", variables.recipientId.toString()]
      });
    }
  });
}
function useMyGroups() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["myGroups"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyGroups();
    },
    enabled: !!actor && !actorFetching
  });
}
function useGroup(groupId) {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["group", groupId == null ? void 0 : groupId.toString()],
    queryFn: async () => {
      if (!actor || groupId === null) return null;
      return actor.getGroup(groupId);
    },
    enabled: !!actor && !actorFetching && groupId !== null
  });
}
function useGroupMessages(groupId) {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["groupMessages", groupId == null ? void 0 : groupId.toString()],
    queryFn: async () => {
      if (!actor || groupId === null) return [];
      return actor.getGroupMessages(groupId);
    },
    enabled: !!actor && !actorFetching && groupId !== null,
    refetchInterval: 3e3
  });
}
function useCreateGroup() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createGroup(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
    }
  });
}
function useSendGroupMessage() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      groupId,
      content,
      mediaUrl,
      mediaType
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.sendGroupMessage(
        groupId,
        content,
        mediaUrl ?? null,
        mediaType ?? MediaType.none
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["groupMessages", variables.groupId.toString()]
      });
    }
  });
}
function useLeaveGroup() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (groupId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.leaveGroup(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
    }
  });
}
function useRequestMediaUploadUrl() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (blobHash) => {
      if (!actor) throw new Error("Actor not available");
      return actor.requestMediaUploadUrl(blobHash);
    }
  });
}
function useGetMediaDownloadUrl() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (storageKey) => {
      if (!actor) throw new Error("Actor not available");
      return actor.getMediaDownloadUrl(storageKey);
    }
  });
}
function useCreateCallRoom() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      recipientId,
      callType
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.createCallRoom(recipientId, callType);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    }
  });
}
function useActiveStatusPosts() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["statusPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveStatusPosts();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 1e4
  });
}
function useCreateStatusPost() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createStatusPost(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statusPosts"] });
    }
  });
}
function useDeleteStatusPost() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteStatusPost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statusPosts"] });
    }
  });
}
function useChannels() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listChannels();
    },
    enabled: !!actor && !actorFetching
  });
}
function useChannelPosts(channelId) {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["channelPosts", channelId == null ? void 0 : channelId.toString()],
    queryFn: async () => {
      if (!actor || channelId === null) return [];
      return actor.getChannelPosts(channelId);
    },
    enabled: !!actor && !actorFetching && channelId !== null,
    refetchInterval: 5e3
  });
}
function useCreateChannel() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      description
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createChannel(name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    }
  });
}
function usePostToChannel() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      channelId,
      content
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.postToChannel(channelId, content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["channelPosts", variables.channelId.toString()]
      });
    }
  });
}
function useMyVerificationRequest() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["myVerificationRequest"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyVerificationRequest();
    },
    enabled: !!actor && !actorFetching
  });
}
function useSubmitVerificationRequest() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (receiptStorageKey) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.submitVerificationRequest(receiptStorageKey);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myVerificationRequest"] });
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
    }
  });
}
function useAdminTotalRevenue() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["adminRevenue"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.adminGetTotalRevenue();
    },
    enabled: !!actor && !actorFetching
  });
}
function useAdminVerificationRequests() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["adminVerificationRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListVerificationRequests();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 15e3
  });
}
function useAdminApproveVerification() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.adminApproveVerification(userId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminVerificationRequests"]
      });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    }
  });
}
function useAdminRejectVerification() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.adminRejectVerification(userId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminVerificationRequests"]
      });
    }
  });
}
function useAdminUsers() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListUsers();
    },
    enabled: !!actor && !actorFetching
  });
}
function useAdminPayoutRequests() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["adminPayouts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListPayoutRequests();
    },
    enabled: !!actor && !actorFetching
  });
}
function useAdminRequestPayout() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.adminRequestPayout();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPayouts"] });
      queryClient.invalidateQueries({ queryKey: ["adminRevenue"] });
    }
  });
}
const NAV_ITEMS = [
  {
    label: "Chats",
    path: "/chats",
    icon: MessageCircle,
    ocid: "nav.chats_tab"
  },
  { label: "Groups", path: "/groups", icon: Users, ocid: "nav.groups_tab" },
  { label: "Status", path: "/status", icon: Radio, ocid: "nav.status_tab" },
  {
    label: "Channels",
    path: "/channels",
    icon: Hash,
    ocid: "nav.channels_tab"
  },
  { label: "More", path: "/more", icon: Ellipsis, ocid: "nav.more_tab" }
];
function Layout({ children, showNav = true }) {
  const location = useLocation();
  const { data: isAdmin } = useIsAdmin();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-screen bg-background overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex h-full", children: [
      showNav && /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-16 flex flex-col items-center py-4 bg-card border-r border-border/50 gap-1 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/chats", className: "mb-4", "aria-label": "GlintChat home", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-primary text-sm", children: "G" }) }) }),
        NAV_ITEMS.map(({ label, path, icon: Icon, ocid }) => {
          const active = location.pathname.startsWith(path);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: path,
              "data-ocid": ocid,
              className: `w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-smooth group ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
              title: label,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18 })
            },
            path
          );
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
        isAdmin === true && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/admin",
            "data-ocid": "nav.admin_link",
            className: "w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-smooth",
            title: "Admin",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 18 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/more",
            "data-ocid": "nav.settings_link",
            className: "w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-smooth",
            title: "Settings",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 18 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/privacy",
            "data-ocid": "nav.privacy_link",
            className: "w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-smooth",
            title: "Privacy Policy",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 18 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-hidden", children })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex md:hidden flex-col h-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-card border-b border-border/50 px-4 py-3 flex items-center justify-between shrink-0 elevation-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogoWithText, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-hidden", children }),
      showNav && /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "bg-card border-t border-border/50 flex items-center justify-around px-2 py-2 shrink-0 elevation-sm", children: NAV_ITEMS.map(({ label, path, icon: Icon, ocid }) => {
        const active = location.pathname.startsWith(path);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: path,
            "data-ocid": ocid,
            className: `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-smooth min-w-[44px] ${active ? "text-primary" : "text-muted-foreground"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 20 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium", children: label })
            ]
          },
          path
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex justify-center py-1.5 bg-card border-t border-border/30 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "a",
      {
        href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
          typeof window !== "undefined" ? window.location.hostname : ""
        )}`,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "text-[10px] text-muted-foreground hover:text-foreground transition-colors",
        children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          ". Built with love using caffeine.ai"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "hidden md:flex fixed bottom-2 left-0 w-16 justify-center",
        "aria-label": "Privacy Policy",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/privacy",
            "data-ocid": "footer.privacy_link",
            className: "text-[9px] text-muted-foreground hover:text-foreground transition-colors px-1 text-center leading-tight",
            title: "Privacy Policy",
            children: "Privacy"
          }
        )
      }
    )
  ] });
}
export {
  useAdminTotalRevenue as A,
  useAdminVerificationRequests as B,
  CallType as C,
  useAdminPayoutRequests as D,
  useAdminRequestPayout as E,
  useAdminApproveVerification as F,
  useAdminRejectVerification as G,
  Hash as H,
  Layout as L,
  MediaType as M,
  PayoutStatus as P,
  Radio as R,
  Shield as S,
  Users as U,
  VerificationStatus as V,
  useMyGroups as a,
  useAdminUsers as b,
  useGetUserByPhone as c,
  useRegisterUser as d,
  useUserProfile as e,
  useDirectMessages as f,
  useSendDirectMessage as g,
  useRequestMediaUploadUrl as h,
  useCreateCallRoom as i,
  useCreateGroup as j,
  useGroup as k,
  useGroupMessages as l,
  useSendGroupMessage as m,
  useLeaveGroup as n,
  useGetMediaDownloadUrl as o,
  useActiveStatusPosts as p,
  useCreateStatusPost as q,
  useDeleteStatusPost as r,
  useChannels as s,
  useCreateChannel as t,
  useCallerProfile as u,
  useIsAdmin as v,
  useChannelPosts as w,
  usePostToChannel as x,
  useMyVerificationRequest as y,
  useSubmitVerificationRequest as z
};
