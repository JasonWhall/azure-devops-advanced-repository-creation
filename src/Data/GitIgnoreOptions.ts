import { IListBoxItem } from 'azure-devops-ui/ListBox';

/**
 * We have to store this data in the extension as there isn't a reliable, documented API we can call.
 * This is stored in https://dev.azure.com/{organisation}/{project}/_apis/git/templates?type=gitignore
 * However it requires either an Oauth token which we cannot retrieve, or a full-scope PAT
 * which is not feasible for this extension
 */
export const GitIgnoreOptions: IListBoxItem[] = [
  {
    id: 'None.gitignore',
    text: 'None',
  },
  {
    id: 'Actionscript.gitignore',
    text: 'Actionscript',
  },
  {
    id: 'Ada.gitignore',
    text: 'Ada',
  },
  {
    id: 'Agda.gitignore',
    text: 'Agda',
  },
  {
    id: 'Android.gitignore',
    text: 'Android',
  },
  {
    id: 'AppceleratorTitanium.gitignore',
    text: 'AppceleratorTitanium',
  },
  {
    id: 'AppEngine.gitignore',
    text: 'AppEngine',
  },
  {
    id: 'ArchLinuxPackages.gitignore',
    text: 'ArchLinuxPackages',
  },
  {
    id: 'Autotools.gitignore',
    text: 'Autotools',
  },
  {
    id: 'C++.gitignore',
    text: 'C++',
  },
  {
    id: 'C.gitignore',
    text: 'C',
  },
  {
    id: 'CakePHP.gitignore',
    text: 'CakePHP',
  },
  {
    id: 'CFWheels.gitignore',
    text: 'CFWheels',
  },
  {
    id: 'ChefCookbook.gitignore',
    text: 'ChefCookbook',
  },
  {
    id: 'Clojure.gitignore',
    text: 'Clojure',
  },
  {
    id: 'CMake.gitignore',
    text: 'CMake',
  },
  {
    id: 'CodeIgniter.gitignore',
    text: 'CodeIgniter',
  },
  {
    id: 'CommonLisp.gitignore',
    text: 'CommonLisp',
  },
  {
    id: 'Composer.gitignore',
    text: 'Composer',
  },
  {
    id: 'Concrete5.gitignore',
    text: 'Concrete5',
  },
  {
    id: 'Coq.gitignore',
    text: 'Coq',
  },
  {
    id: 'CraftCMS.gitignore',
    text: 'CraftCMS',
  },
  {
    id: 'CUDA.gitignore',
    text: 'CUDA',
  },
  {
    id: 'D.gitignore',
    text: 'D',
  },
  {
    id: 'Dart.gitignore',
    text: 'Dart',
  },
  {
    id: 'Delphi.gitignore',
    text: 'Delphi',
  },
  {
    id: 'DM.gitignore',
    text: 'DM',
  },
  {
    id: 'Drupal.gitignore',
    text: 'Drupal',
  },
  {
    id: 'Eagle.gitignore',
    text: 'Eagle',
  },
  {
    id: 'Elisp.gitignore',
    text: 'Elisp',
  },
  {
    id: 'Elixir.gitignore',
    text: 'Elixir',
  },
  {
    id: 'Elm.gitignore',
    text: 'Elm',
  },
  {
    id: 'EPiServer.gitignore',
    text: 'EPiServer',
  },
  {
    id: 'Erlang.gitignore',
    text: 'Erlang',
  },
  {
    id: 'ExpressionEngine.gitignore',
    text: 'ExpressionEngine',
  },
  {
    id: 'ExtJs.gitignore',
    text: 'ExtJs',
  },
  {
    id: 'Fancy.gitignore',
    text: 'Fancy',
  },
  {
    id: 'Finale.gitignore',
    text: 'Finale',
  },
  {
    id: 'ForceDotCom.gitignore',
    text: 'ForceDotCom',
  },
  {
    id: 'Fortran.gitignore',
    text: 'Fortran',
  },
  {
    id: 'FuelPHP.gitignore',
    text: 'FuelPHP',
  },
  {
    id: 'gcov.gitignore',
    text: 'gcov',
  },
  {
    id: 'GitBook.gitignore',
    text: 'GitBook',
  },
  {
    id: 'Go.gitignore',
    text: 'Go',
  },
  {
    id: 'Godot.gitignore',
    text: 'Godot',
  },
  {
    id: 'Gradle.gitignore',
    text: 'Gradle',
  },
  {
    id: 'Grails.gitignore',
    text: 'Grails',
  },
  {
    id: 'GWT.gitignore',
    text: 'GWT',
  },
  {
    id: 'Haskell.gitignore',
    text: 'Haskell',
  },
  {
    id: 'Idris.gitignore',
    text: 'Idris',
  },
  {
    id: 'IGORPro.gitignore',
    text: 'IGORPro',
  },
  {
    id: 'Java.gitignore',
    text: 'Java',
  },
  {
    id: 'Jboss.gitignore',
    text: 'Jboss',
  },
  {
    id: 'Jekyll.gitignore',
    text: 'Jekyll',
  },
  {
    id: 'JENKINS_HOME.gitignore',
    text: 'JENKINS_HOME',
  },
  {
    id: 'Joomla.gitignore',
    text: 'Joomla',
  },
  {
    id: 'Julia.gitignore',
    text: 'Julia',
  },
  {
    id: 'KiCAD.gitignore',
    text: 'KiCAD',
  },
  {
    id: 'Kohana.gitignore',
    text: 'Kohana',
  },
  {
    id: 'Kotlin.gitignore',
    text: 'Kotlin',
  },
  {
    id: 'LabVIEW.gitignore',
    text: 'LabVIEW',
  },
  {
    id: 'Laravel.gitignore',
    text: 'Laravel',
  },
  {
    id: 'Leiningen.gitignore',
    text: 'Leiningen',
  },
  {
    id: 'LemonStand.gitignore',
    text: 'LemonStand',
  },
  {
    id: 'Lilypond.gitignore',
    text: 'Lilypond',
  },
  {
    id: 'Lithium.gitignore',
    text: 'Lithium',
  },
  {
    id: 'Lua.gitignore',
    text: 'Lua',
  },
  {
    id: 'Magento.gitignore',
    text: 'Magento',
  },
  {
    id: 'Maven.gitignore',
    text: 'Maven',
  },
  {
    id: 'Mercury.gitignore',
    text: 'Mercury',
  },
  {
    id: 'MetaProgrammingSystem.gitignore',
    text: 'MetaProgrammingSystem',
  },
  {
    id: 'nanoc.gitignore',
    text: 'nanoc',
  },
  {
    id: 'Nim.gitignore',
    text: 'Nim',
  },
  {
    id: 'Node.gitignore',
    text: 'Node',
  },
  {
    id: 'Objective-C.gitignore',
    text: 'Objective-C',
  },
  {
    id: 'OCaml.gitignore',
    text: 'OCaml',
  },
  {
    id: 'Opa.gitignore',
    text: 'Opa',
  },
  {
    id: 'opencart.gitignore',
    text: 'opencart',
  },
  {
    id: 'OracleForms.gitignore',
    text: 'OracleForms',
  },
  {
    id: 'Packer.gitignore',
    text: 'Packer',
  },
  {
    id: 'Perl.gitignore',
    text: 'Perl',
  },
  {
    id: 'Phalcon.gitignore',
    text: 'Phalcon',
  },
  {
    id: 'PlayFramework.gitignore',
    text: 'PlayFramework',
  },
  {
    id: 'Plone.gitignore',
    text: 'Plone',
  },
  {
    id: 'Prestashop.gitignore',
    text: 'Prestashop',
  },
  {
    id: 'Processing.gitignore',
    text: 'Processing',
  },
  {
    id: 'PureScript.gitignore',
    text: 'PureScript',
  },
  {
    id: 'Python.gitignore',
    text: 'Python',
  },
  {
    id: 'Qooxdoo.gitignore',
    text: 'Qooxdoo',
  },
  {
    id: 'Qt.gitignore',
    text: 'Qt',
  },
  {
    id: 'R.gitignore',
    text: 'R',
  },
  {
    id: 'Rails.gitignore',
    text: 'Rails',
  },
  {
    id: 'Raku.gitignore',
    text: 'Raku',
  },
  {
    id: 'RhodesRhomobile.gitignore',
    text: 'RhodesRhomobile',
  },
  {
    id: 'ROS.gitignore',
    text: 'ROS',
  },
  {
    id: 'Ruby.gitignore',
    text: 'Ruby',
  },
  {
    id: 'Rust.gitignore',
    text: 'Rust',
  },
  {
    id: 'Sass.gitignore',
    text: 'Sass',
  },
  {
    id: 'Scala.gitignore',
    text: 'Scala',
  },
  {
    id: 'Scheme.gitignore',
    text: 'Scheme',
  },
  {
    id: 'SCons.gitignore',
    text: 'SCons',
  },
  {
    id: 'Scrivener.gitignore',
    text: 'Scrivener',
  },
  {
    id: 'Sdcc.gitignore',
    text: 'Sdcc',
  },
  {
    id: 'SeamGen.gitignore',
    text: 'SeamGen',
  },
  {
    id: 'SketchUp.gitignore',
    text: 'SketchUp',
  },
  {
    id: 'Smalltalk.gitignore',
    text: 'Smalltalk',
  },
  {
    id: 'stella.gitignore',
    text: 'stella',
  },
  {
    id: 'SugarCRM.gitignore',
    text: 'SugarCRM',
  },
  {
    id: 'Swift.gitignore',
    text: 'Swift',
  },
  {
    id: 'Symfony.gitignore',
    text: 'Symfony',
  },
  {
    id: 'SymphonyCMS.gitignore',
    text: 'SymphonyCMS',
  },
  {
    id: 'Terraform.gitignore',
    text: 'Terraform',
  },
  {
    id: 'TeX.gitignore',
    text: 'TeX',
  },
  {
    id: 'Textpattern.gitignore',
    text: 'Textpattern',
  },
  {
    id: 'TurboGears2.gitignore',
    text: 'TurboGears2',
  },
  {
    id: 'Typo3.gitignore',
    text: 'Typo3',
  },
  {
    id: 'Umbraco.gitignore',
    text: 'Umbraco',
  },
  {
    id: 'Unity.gitignore',
    text: 'Unity',
  },
  {
    id: 'UnrealEngine.gitignore',
    text: 'UnrealEngine',
  },
  {
    id: 'VisualStudio.gitignore',
    text: 'VisualStudio',
  },
  {
    id: 'VVVV.gitignore',
    text: 'VVVV',
  },
  {
    id: 'Waf.gitignore',
    text: 'Waf',
  },
  {
    id: 'WordPress.gitignore',
    text: 'WordPress',
  },
  {
    id: 'Xojo.gitignore',
    text: 'Xojo',
  },
  {
    id: 'Yeoman.gitignore',
    text: 'Yeoman',
  },
  {
    id: 'Yii.gitignore',
    text: 'Yii',
  },
  {
    id: 'ZendFramework.gitignore',
    text: 'ZendFramework',
  },
  {
    id: 'Zephir.gitignore',
    text: 'Zephir',
  },
];
