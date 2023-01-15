import { IdentityDescriptor } from 'azure-devops-extension-api/Identities';

/**
 * The AccessControlList class is meant to associate a set of AccessControlEntries with a security token and its inheritance settings.
 */
export interface AccessControlList {
  /**
   * Storage of permissions keyed on the identity the permission is for.
   */
  accessControlEntries?: AccessControlEntry[];

  /**
   * The token that this AccessControlList is for.
   */
  token?: string;

  /**
   * In the case of a collision (by identity descriptor) with an existing ACE in the ACL, the "merge" parameter determines the behavior.
   * If set, the existing ACE has its allow and deny merged with the incoming ACE's allow and deny. If unset, the existing ACE is displaced
   */
  merge?: boolean;
}

/**
 * Class for encapsulating the allowed and denied permissions for a given IdentityDescriptor.
 */
export interface AccessControlEntry {
  /**
   * The set of permission bits that represent the actions that the associated descriptor is allowed to perform.
   */
  allow?: number;

  /**
   * The set of permission bits that represent the actions that the associated descriptor is not allowed to perform.
   */
  deny?: number;

  /**
   * The descriptor for the user this AccessControlEntry applies to.
   */
  descriptor?: IdentityDescriptor | string;

  /**
   * This value, when set, reports the inherited and effective information for the associated descriptor. This value is only set on AccessControlEntries returned by the QueryAccessControlList(s) call when its includeExtendedInfo parameter is set to true.
   */
  extendedInfo?: AceExtendedInformation;
}

/**
 * Holds the inherited and effective permission information for a given AccessControlEntry.
 */
export interface AceExtendedInformation {
  /**
   * This is the combination of all of the explicit and inherited permissions for this identity on this token.  These are the permissions used when determining if a given user has permission to perform an action.
   */
  effectiveAllow?: number;

  /**
   * This is the combination of all of the explicit and inherited permissions for this identity on this token.  These are the permissions used when determining if a given user has permission to perform an action.
   */
  effectiveDeny?: number;

  /**
   * These are the permissions that are inherited for this identity on this token.  If the token does not inherit permissions this will be 0.  Note that any permissions that have been explicitly set on this token for this identity, or any groups that this identity is a part of, are not included here.
   */
  inheritedAllow?: number;

  /**
   * These are the permissions that are inherited for this identity on this token.  If the token does not inherit permissions this will be 0.  Note that any permissions that have been explicitly set on this token for this identity, or any groups that this identity is a part of, are not included here.
   */
  inheritedDeny?: number;
}
